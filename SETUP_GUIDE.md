# Constellation Setup Guide

Complete setup instructions to get Constellation running locally.

## Prerequisites

- Node.js 18+ installed
- npm/yarn/pnpm
- Supabase account and project
- Git (for cloning)

## Step 1: Clone and Install

```bash
cd constellation-app
npm install
```

## Step 2: Set Up Environment Variables

Create `.env.local` in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

Get these values from:
- Supabase Dashboard → Project Settings → API

## Step 3: Set Up Database

### 3a. Run Base Schema

1. Open Supabase Dashboard
2. Go to **SQL Editor**
3. Open `schema.sql`
4. Copy entire contents
5. Paste into SQL Editor
6. Click **Run**

### 3b. Run Migrations

1. Still in SQL Editor
2. Open `schema-migrations.sql`
3. Copy entire contents
4. Paste and **Run**

### 3c. Verify Migrations

1. Open `verify-migrations.sql`
2. Copy and run
3. Should see: `✅ All migrations verified successfully!`

## Step 4: Configure Supabase Email Template

1. Go to Supabase Dashboard
2. Navigate to **Authentication** → **Email Templates**
3. Edit **Magic Link** template
4. Ensure the link contains: `{{ .ConfirmationURL }}`
5. Set redirect URL in project settings:
   - **Authentication** → **URL Configuration**
   - Add to **Redirect URLs**: `http://localhost:3000/auth/callback`

## Step 5: Test Database Connection

```bash
npm run test:db
```

Should see all ✅ checks passing.

## Step 6: Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Step 7: Test the Application

### Quick Test Flow

1. **Login**
   - Go to `/login`
   - Enter your email
   - Check email for magic link
   - Click link to authenticate

2. **Create Group**
   - Click "Create Group"
   - Fill in name and description
   - Submit

3. **Generate Cadence**
   - On group page, click "Generate Monthly Cadence"
   - (You'll need at least 2 members - join with another account)

4. **Submit Reflection**
   - Select sentiment
   - Write reflection
   - Submit

5. **View Journal**
   - Go to `/journal`
   - See all your reflections

## Troubleshooting

### "Cookies can only be modified..."
- Make sure API routes use `supabaseServerAction()`
- ✅ Already fixed in code

### "Missing tokens in callback"
- Verify callback route is at `/auth/callback/route.ts`
- ✅ Already correct

### Database connection fails
- Check `.env.local` has correct values
- Verify Supabase project is active
- Run `npm run test:db`

### Migrations fail
- Make sure you ran `schema.sql` first
- Check for existing columns (migration uses `IF NOT EXISTS`)
- See `MIGRATION_INSTRUCTIONS.md` for details

### Magic link not working
- Check email template has `{{ .ConfirmationURL }}`
- Verify redirect URL in Supabase settings
- Check spam folder

## File Structure

```
constellation-app/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── groups/            # Group pages
│   ├── journal/           # Personal journal
│   ├── login/             # Login page
│   └── me/                # User profile
├── components/            # React components
├── lib/                   # Utilities
│   ├── questions.ts       # Question deck
│   ├── cadence.ts         # Cadence engine
│   └── supabase-*.ts      # Supabase clients
├── schema.sql             # Base database schema
├── schema-migrations.sql  # MVP migrations
└── verify-migrations.sql  # Migration verification
```

## Next Steps

After setup:
1. ✅ Test all features (see `TESTING_GUIDE.md`)
2. ✅ Review `IMPLEMENTATION_SUMMARY.md` for feature list
3. ✅ Customize questions/content as needed
4. ✅ Deploy to production when ready

## Production Deployment

When ready to deploy:

1. **Update Environment Variables**
   - Set `NEXT_PUBLIC_BASE_URL` to production URL
   - Update Supabase redirect URLs

2. **Run Migrations in Production**
   - Run `schema.sql` and `schema-migrations.sql` in production Supabase

3. **Deploy**
   - Vercel: `vercel deploy`
   - Or your preferred platform

## Support

- Check `CONTEXT.md` for architecture details
- Check `ARCHITECTURE.md` for system design
- Check `TESTING_GUIDE.md` for test scenarios

