import { NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from './prisma';
import { CustomPrismaAdapter } from './custom-prisma-adapter';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      isAdmin?: boolean;
    };
  }
}

export const authOptions: NextAuthOptions = {
  adapter: CustomPrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT) || 587,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM || 'IRC26 <no-reply@irc26.example>',
    }),
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('ADMIN DEBUG: authorize called', {
          hasEmail: !!credentials?.email,
          hasPassword: !!credentials?.password,
        });

        if (!credentials?.email || !credentials?.password) {
          console.log('ADMIN DEBUG: Missing credentials');
          return null;
        }

        // Check against admin credentials from env
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminEmail || !adminPassword) {
          console.error('ADMIN_EMAIL or ADMIN_PASSWORD not set in environment variables');
          return null;
        }

        console.log('ADMIN DEBUG: Comparing credentials', {
          providedEmail: credentials.email,
          adminEmail,
          emailMatch: credentials.email === adminEmail,
          passwordMatch: credentials.password === adminPassword,
        });

        // Compare credentials
        if (
          credentials.email !== adminEmail ||
          credentials.password !== adminPassword
        ) {
          console.log('ADMIN DEBUG: Credentials do not match');
          return null;
        }

        console.log('ADMIN DEBUG: Credentials match, proceeding...');

        // Credentials match - ensure admin user exists in database
        // Find or create the admin user
        let user = await prisma.user.findUnique({
          where: { email: adminEmail },
        });

        if (!user) {
          // Create admin user if it doesn't exist
          user = await prisma.user.create({
            data: {
              email: adminEmail,
              gcUsername: 'Admin',
            },
          });
        }

        // Ensure Account record exists for Credentials provider (required for database sessions)
        const account = await prisma.account.findUnique({
          where: {
            provider_providerAccountId: {
              provider: 'credentials',
              providerAccountId: user.id,
            },
          },
        });

        if (!account) {
          await prisma.account.create({
            data: {
              userId: user.id,
              type: 'credentials',
              provider: 'credentials',
              providerAccountId: user.id,
            },
          });
          console.log('ADMIN DEBUG Credentials authorize - Account created for user:', user.id);
        }

        // Debug logging
        console.log('ADMIN DEBUG Credentials authorize - user found/created:', {
          id: user.id,
          email: user.email,
          adminEmail,
          match: user.email === adminEmail,
          accountExists: !!account,
        });

        // Return user object that matches Prisma User model
        // The email MUST match ADMIN_EMAIL exactly
        return {
          id: user.id,
          email: user.email, // This should be adminEmail
          name: 'Admin',
          gcUsername: user.gcUsername || 'Admin',
        };
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify-request',
  },
  callbacks: {
    async jwt({ token, user }) {
      // This callback runs for Credentials provider
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.isAdmin = user.email === process.env.ADMIN_EMAIL;
        console.log('ADMIN DEBUG jwt callback:', {
          userId: user.id,
          userEmail: user.email,
          adminEmail: process.env.ADMIN_EMAIL,
          isAdmin: token.isAdmin,
        });
      }
      return token;
    },
    async session({ session, user, token }) {
      console.log('ADMIN DEBUG: session callback called', {
        hasSession: !!session,
        hasUser: !!user,
        hasToken: !!token,
        sessionUserEmail: session?.user?.email,
      });
      
      // With database sessions, user should be provided
      // But Credentials provider might use token instead
      if (user) {
        // Database session - user is provided
        session.user.id = user.id;
        session.user.email = user.email;
        session.user.isAdmin = user.email === process.env.ADMIN_EMAIL;
        
        console.log('ADMIN DEBUG session callback (user provided):', {
          userId: user.id,
          userEmail: user.email,
          sessionUserEmail: session.user.email,
          adminEmail: process.env.ADMIN_EMAIL,
          isAdmin: session.user.isAdmin,
        });
      } else if (token) {
        // Credentials provider - use token
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.isAdmin = token.isAdmin as boolean;
        
        console.log('ADMIN DEBUG session callback (token provided):', {
          tokenId: token.id,
          tokenEmail: token.email,
          adminEmail: process.env.ADMIN_EMAIL,
          isAdmin: token.isAdmin,
        });
      } else if (session.user?.email) {
        // Fallback - fetch from DB
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email },
        });
        
        if (dbUser) {
          session.user.id = dbUser.id;
          session.user.email = dbUser.email;
          session.user.isAdmin = dbUser.email === process.env.ADMIN_EMAIL;
          
          console.log('ADMIN DEBUG session callback (fetched from DB):', {
            userId: dbUser.id,
            dbUserEmail: dbUser.email,
            adminEmail: process.env.ADMIN_EMAIL,
            isAdmin: session.user.isAdmin,
          });
        }
      }
      
      return session;
    },
  },
  session: {
    strategy: 'database',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
};

export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return email === process.env.ADMIN_EMAIL;
}

