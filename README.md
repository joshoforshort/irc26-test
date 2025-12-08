# It's Raining Caches 2026 (IRC26)

A production-quality web application for the IRC26 geocaching initiative, built with Next.js, TypeScript, Prisma, and PostgreSQL.

## Features

- **Public Landing Page**: Display headline stats and information about IRC26
- **Pledge System**: Allow geocachers to pledge their intent to hide caches
- **Confirmation System**: Allow geocachers to confirm published caches with GC codes
- **Magic Link Management**: Secure email-based editing for users to manage their entries
- **Admin Dashboard**: Protected admin area for organizers to view detailed analytics and manage data
- **CSV Exports**: Export pledges and confirmations for analysis

## Tech Stack

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** for styling
- **Prisma ORM** for database management
- **PostgreSQL** for data storage
- **NextAuth/JWT** for admin authentication
- **Zod** for validation
- **Jose** for JWT handling

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Environment variables configured (see `.env.example`)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/irc26?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"

# Admin
ADMIN_EMAIL="admin@irc26.com"
ADMIN_PASSWORD="change-me-in-production"

# Email (for magic links - placeholder implementation)
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_USER="noreply@irc26.com"
SMTP_PASSWORD="your-email-password"
SMTP_FROM="noreply@irc26.com"

# App URL (for magic links)
APP_URL="http://localhost:3000"
```

### 3. Set Up Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Or create a migration
npm run db:migrate
```

### 4. Seed Admin User

```bash
npm run seed:admin
```

This will create an admin user with the credentials from your `.env` file.

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   │   ├── admin/        # Admin API endpoints
│   │   ├── manage/       # User management endpoints
│   │   ├── confirm/      # Confirmation submission
│   │   ├── pledge/       # Pledge submission
│   │   └── stats/        # Public stats endpoint
│   ├── admin/            # Admin dashboard pages
│   ├── confirm/          # Confirmation form page
│   ├── manage/           # User management page
│   ├── pledge/           # Pledge form page
│   └── page.tsx          # Landing page
├── components/           # React components
├── config/               # Configuration files
│   └── irc26.ts         # IRC26 event dates and constants
├── lib/                  # Utility libraries
│   ├── admin-auth.ts    # Admin authentication
│   ├── auth.ts          # User authentication utilities
│   ├── email.ts         # Email functionality
│   ├── prisma.ts        # Prisma client
│   └── validation.ts    # Zod validation schemas
├── prisma/
│   └── schema.prisma    # Database schema
└── scripts/
    └── seed-admin.ts    # Admin user seeding script
```

## Key Configuration

Event dates are configured in `config/irc26.ts`:

- `RAIN_START_DATE`: When the official "It's Raining Caches" period starts
- `SUBMISSION_DEADLINE`: Final date to confirm caches

These dates are used throughout the application for countdown timers and validation.

## Database Models

- **User**: Geocachers who pledge or confirm caches
- **Pledge**: Intent to hide caches
- **Confirmation**: Confirmed published caches
- **EditToken**: Magic link tokens for user editing
- **AdminUser**: Admin accounts for the dashboard

## API Endpoints

### Public Endpoints

- `GET /api/stats` - Public statistics
- `POST /api/pledge` - Submit a pledge
- `POST /api/confirm` - Submit a confirmation
- `POST /api/edit-token` - Request a magic link

### User Management Endpoints (require token)

- `GET /api/manage?token=...` - Get user's pledges and confirmations
- `PUT /api/manage/pledge/:id?token=...` - Update a pledge
- `DELETE /api/manage/pledge/:id?token=...` - Delete a pledge
- `PUT /api/manage/confirmation/:id?token=...` - Update a confirmation
- `DELETE /api/manage/confirmation/:id?token=...` - Delete a confirmation

### Admin Endpoints (require admin session)

- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/stats` - Detailed admin statistics
- `GET /api/admin/pledges` - List all pledges
- `GET /api/admin/confirmations` - List all confirmations
- `GET /api/admin/export/pledges` - Export pledges as CSV
- `GET /api/admin/export/confirmations` - Export confirmations as CSV

## Email Functionality

The email functionality is currently implemented as a placeholder that logs to the console. To enable real emails:

1. Update `lib/email.ts` with your email service provider (SendGrid, AWS SES, etc.)
2. Configure SMTP settings in your `.env` file
3. The magic links will be sent when users:
   - Submit a pledge
   - Submit a confirmation
   - Request a new magic link

## Security Features

- Server-side validation on all API routes using Zod
- Magic link tokens expire after 7 days
- Admin routes are protected with JWT sessions
- Users can only edit their own entries via valid tokens
- Confirmed cache details are not exposed publicly (admin-only)

## Development

### Database Studio

View and edit your database using Prisma Studio:

```bash
npm run db:studio
```

### Building for Production

```bash
npm run build
npm start
```

## Notes

- Confirmed cache details are only visible to admins and the cache owner (via magic link)
- The public landing page only shows aggregate statistics
- Magic links are sent via email after pledge/confirmation submission
- Admin authentication uses JWT tokens stored in HTTP-only cookies

## License

This project is private and proprietary.





