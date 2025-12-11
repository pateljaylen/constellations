# Quick Start Checklist

> **For detailed step-by-step instructions with verification checkpoints, see [STEP_BY_STEP_SETUP.md](./STEP_BY_STEP_SETUP.md)**

Follow these steps in order to get Constellation running:

## ✅ Pre-Flight Checklist

- [ ] Node.js 18+ installed
- [ ] Supabase account created
- [ ] Supabase project created

## 🚀 Setup Steps (15 minutes)

### 1. Install Dependencies
```bash
cd constellation-app
npm install
```

### 2. Environment Variables
Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Database Setup
1. Supabase Dashboard → SQL Editor
2. Run `schema.sql` (copy/paste, click Run)
3. Run `schema-migrations.sql`
4. Run `verify-migrations.sql` (should see ✅)

### 4. Email Configuration
- Supabase → Authentication → Email Templates
- Magic Link template must have: `{{ .ConfirmationURL }}`
- Add redirect URL: `http://localhost:3000/auth/callback`

### 5. Test Connection
```bash
npm run test:db
```

### 6. Start Server
```bash
npm run dev
```

### 7. Test Login
- Go to http://localhost:3000/login
- Enter email
- Check email for magic link
- Click link

## 🎯 First Actions

1. **Create a Group**
   - Click "Create Group"
   - Name it, add description
   - Submit

2. **Generate Cadence** (needs 2+ members)
   - Join group with another account
   - As creator, click "Generate Monthly Cadence"

3. **Submit Reflection**
   - Select sentiment
   - Write reflection
   - Submit

4. **Explore**
   - View `/journal` for all your reflections
   - View `/groups/[id]/wrap` for monthly summary

## 📚 Documentation

- **SETUP_GUIDE.md** - Detailed setup instructions
- **TESTING_GUIDE.md** - Complete test scenarios
- **IMPLEMENTATION_SUMMARY.md** - Feature list
- **MIGRATION_INSTRUCTIONS.md** - Database migration details

## 🆘 Common Issues

**"Cookies can only be modified"**
- ✅ Already fixed in code

**"Missing tokens in callback"**
- ✅ Already fixed in code

**Database connection fails**
- Check `.env.local` values
- Verify Supabase project is active

**Magic link not working**
- Check email template
- Verify redirect URL in Supabase

## ✨ You're Ready!

Once you see the login page, you're good to go! 🎉

