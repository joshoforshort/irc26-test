# IRC26 Implementation Notes

## What Has Been Implemented

### 1. Database Schema (Prisma)
- ✅ Updated schema with new models: User, Pledge, Submission, AuditLog
- ✅ Added NextAuth tables: Account, Session, VerificationToken
- ✅ Enums: CacheType, CacheSize, AUState, PledgeStatus

### 2. Authentication
- ✅ NextAuth with Email provider (magic links)
- ✅ Admin helper function `isAdmin()` based on ADMIN_EMAIL env var
- ✅ Session management with database strategy
- ✅ Auth pages: /auth/signin, /auth/verify-request

### 3. API Routes
- ✅ `/api/pledges` - POST (create)
- ✅ `/api/pledges/me` - GET (user's pledges)
- ✅ `/api/pledges/[id]` - GET, PATCH, DELETE
- ✅ `/api/submissions` - POST (create)
- ✅ `/api/submissions/me` - GET (user's submissions)
- ✅ `/api/submissions/[id]` - GET, PATCH, DELETE
- ✅ `/api/admin/pledges` - GET (with filters)
- ✅ `/api/admin/submissions` - GET (with filters)
- ✅ `/api/admin/audit` - GET
- ✅ `/api/admin/export/pledges` - GET (CSV)
- ✅ `/api/admin/export/submissions` - GET (CSV)
- ✅ `/api/user/me` - GET, PATCH
- ✅ `/api/stats` - GET (public stats)

### 4. Pages
- ✅ `/pledge` - Create pledge form (requires auth)
- ✅ `/pledge/[id]/edit` - Edit pledge
- ✅ `/confirm` - Submit confirmation (requires pledge first)
- ✅ `/submission/[id]/edit` - Edit submission
- ✅ `/account` - User profile and my pledges/submissions
- ✅ `/admin` - Admin dashboard with tabs, filters, detail views
- ✅ `/auth/signin` - Sign in page
- ✅ `/auth/verify-request` - Email verification page

### 5. Features
- ✅ Image uploads via UploadThing (max 3 images, 3MB each)
- ✅ Email confirmations (placeholder - needs real SMTP)
- ✅ Audit logging for admin actions
- ✅ Deadline warning on confirm page
- ✅ Stats API with breakdowns by state and type
- ✅ CSV exports for admin

### 6. Validation
- ✅ Zod schemas for all inputs
- ✅ Pledge validation
- ✅ Submission validation
- ✅ GC code format validation

## Next Steps

### 1. Environment Variables
Add to `.env`:
```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Email (for magic links)
EMAIL_SERVER_HOST=smtp.example.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@example.com
EMAIL_SERVER_PASSWORD=your-password
EMAIL_FROM="IRC26 <no-reply@irc26.example>"

# Admin
ADMIN_EMAIL=admin@example.com

# UploadThing
UPLOADTHING_SECRET=your-uploadthing-secret
UPLOADTHING_APP_ID=your-uploadthing-app-id
```

### 2. Database Migration
```bash
npm run db:generate
npm run db:migrate
```

### 3. UploadThing Setup
1. Sign up at https://uploadthing.com
2. Create a new app
3. Add the API keys to `.env`
4. Configure the file route in UploadThing dashboard

### 4. Email Setup
Update `lib/email.ts` to use a real email service (SendGrid, AWS SES, Resend, etc.)

### 5. Testing Checklist
- [ ] Sign in with email magic link
- [ ] Create a pledge
- [ ] Upload images to pledge
- [ ] Create submission linked to pledge
- [ ] Edit pledge
- [ ] Edit submission
- [ ] View account page
- [ ] Admin can view/edit/delete all records
- [ ] Admin audit log works
- [ ] CSV exports work
- [ ] Stats display correctly
- [ ] Deadline warning shows after deadline

## Important Notes

1. **One Cache Per Pledge**: The new model is one-cache-per-pledge. Old count-based pledges are not migrated.

2. **Geocaching Username**: Users must set their GC username (can be done on first pledge or in account settings).

3. **Pledge → Submission Link**: Submissions must be linked to an existing pledge. Users without pledges are guided to create one first.

4. **Admin Access**: Anyone with email matching `ADMIN_EMAIL` in `.env` is automatically an admin.

5. **Audit Logging**: All admin edits/deletes are logged with before/after snapshots.

6. **Deadline**: Submission deadline is automatically calculated as 14 days before the event date (configurable in `config/irc26.ts`).

## Known Limitations

1. Email functionality is currently a placeholder (logs to console)
2. UploadThing requires API keys to be configured
3. Old data model (count-based pledges) is not migrated - start fresh
4. Admin dashboard detail modal shows JSON (can be improved with better UI)



