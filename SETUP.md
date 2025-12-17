# Setup Guide

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/ventureapp"
   NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
   NEXTAUTH_URL="http://localhost:3000"
   ```

3. **Set up database**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

## Authentication Setup

### Option 1: Email (SMTP)
Add to `.env`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@yourdomain.com
```

### Option 2: Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add to `.env`:
```env
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

## Database Setup

### Local PostgreSQL
```bash
# Install PostgreSQL, then:
createdb ventureapp
# Update DATABASE_URL in .env
```

### Cloud Options
- **Supabase**: Free tier available, get connection string from dashboard
- **Neon**: Serverless Postgres, free tier available
- **Railway**: Easy setup, free tier available

## First Admin User

To create an admin user, you can either:

1. **Via Prisma Studio**:
   ```bash
   npx prisma studio
   ```
   - Navigate to User table
   - Edit a user and set `role` to `"admin"`

2. **Via SQL**:
   ```sql
   UPDATE "User" SET role = 'admin' WHERE email = 'your-email@example.com';
   ```

## File Storage (Optional)

For file uploads, configure S3-compatible storage:

```env
S3_ENDPOINT=https://s3.amazonaws.com
S3_ACCESS_KEY_ID=your-key
S3_SECRET_ACCESS_KEY=your-secret
S3_BUCKET_NAME=your-bucket
S3_REGION=us-east-1
```

**Options:**
- AWS S3
- Cloudflare R2 (free tier)
- DigitalOcean Spaces
- MinIO (self-hosted)

## Testing the Application

1. Start the dev server: `npm run dev`
2. Navigate to `http://localhost:3000`
3. Sign up/Sign in
4. Create a deal from the dashboard
5. Fill in deal metrics
6. Run analysis
7. View results

## Common Issues

### Database Connection Error
- Verify `DATABASE_URL` is correct
- Ensure PostgreSQL is running
- Check firewall/network settings

### Auth Not Working
- Verify `NEXTAUTH_SECRET` is set
- Check provider credentials (SMTP/Google)
- Ensure callback URLs are configured

### Prisma Errors
- Run `npx prisma generate` after schema changes
- Run `npx prisma migrate dev` to apply migrations
- Check `prisma/schema.prisma` for syntax errors

## Next Steps

1. Configure authentication providers
2. Set up file storage (if needed)
3. Create admin user
4. Add initial resources to the library
5. Customize analysis weights in `lib/analysis/scorecard.ts`

