# IRC26 Code

## Overview
This is a Next.js 14 application for managing IRC26 geocaching pledges and submissions. It uses PostgreSQL for data storage via Prisma ORM, NextAuth for authentication, and UploadThing for file uploads.

## Project Architecture

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with email magic links
- **File Uploads**: UploadThing
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI

### Directory Structure
- `/app` - Next.js App Router pages and API routes
- `/components` - React components
- `/lib` - Utility functions, auth config, Prisma client
- `/prisma` - Database schema and migrations
- `/public` - Static assets (images, fonts)
- `/config` - Application configuration
- `/scripts` - Utility scripts (e.g., admin seeding)

### Key Files
- `prisma/schema.prisma` - Database schema
- `lib/auth.ts` - NextAuth configuration
- `lib/prisma.ts` - Prisma client singleton
- `next.config.js` - Next.js configuration

## Development

### Running Locally
The dev server runs on port 5000:
```bash
npm run dev -- -p 5000 -H 0.0.0.0
```

### Database Commands
```bash
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run migrations
npm run db:studio    # Open Prisma Studio
npm run seed:admin   # Seed admin user
```

### Environment Variables
Required environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Session secret for authentication

## Deployment
Configured for autoscale deployment with:
- Build: `npm run build`
- Run: `npm run start -- -p 5000 -H 0.0.0.0`
