# Quick Setup Guide

## 1. Install Dependencies

```bash
npm install
```

## 2. Create `.env` File

Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL
NEXTAUTH_URL
NEXTAUTH_SECRET
ADMIN_EMAIL
ADMIN_PASSWORD
APP_URL
```

## 3. Set Up Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (for development)
npm run db:push

# Or create a migration (for production)
npm run db:migrate
```

## 4. Seed Admin User

```bash
npm run seed:admin
```

This will create an admin user with the credentials from your `.env` file.

## 5. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 6. Access Admin Dashboard

1. Go to `http://localhost:3000/admin`
2. You will be redirected to `/admin/login`
3. Login with the credentials from your `.env` file

## Important Notes

- **Email Functionality**: The email functionality is currently a placeholder that logs to the console. Update `lib/email.ts` to use a real email service (SendGrid, AWS SES, etc.) for production.

- **Event Dates**: Update the dates in `config/irc26.ts`:
  - `RAIN_START_DATE`: When the official "It's Raining Caches" period starts
  - `SUBMISSION_DEADLINE`: Final date to confirm caches

- **Security**: 
  - Change `NEXTAUTH_SECRET` to a strong random string in production
  - Change `ADMIN_PASSWORD` to a secure password
  - Use environment variables for all sensitive data

- **Database**: Make sure your PostgreSQL database is running and accessible before running database commands.

## Troubleshooting

### Prisma Client Not Found
Run `npm run db:generate` to generate the Prisma client.

### Database Connection Error
Check your `DATABASE_URL` in `.env` and ensure PostgreSQL is running.

### Admin Login Not Working
Make sure you've run `npm run seed:admin` after setting up your database.

### Magic Links Not Working
Check the console logs (email is currently logged there). Update `lib/email.ts` to use a real email service.





