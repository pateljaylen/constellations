# Constellation

A web application for group-based weekly reflections, built with Next.js and Supabase.

> **Note**: This repository contains both the working Next.js application and the original product vision/planning documentation. See the `docs/`, `product-spec/`, and other documentation folders for the original product vision and design documents.

## 🚀 Quick Start

**New to setup?** Start here:
- **[STEP_BY_STEP_SETUP.md](./STEP_BY_STEP_SETUP.md)** - Detailed step-by-step guide with verification checkpoints
- **[SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md)** - Printable checklist to track progress
- **[QUICK_START.md](./QUICK_START.md)** - Quick reference (15-minute overview)

## 📋 Prerequisites

- Node.js 18+ 
- npm/yarn/pnpm
- Supabase account and project

## 🔧 Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

3. **Set up Supabase database:**
   - Run `schema.sql` in Supabase SQL Editor
   - Run `schema-migrations.sql` for MVP features
   - See [MIGRATION_INSTRUCTIONS.md](./MIGRATION_INSTRUCTIONS.md) for details

4. **Configure Supabase Email Template:**
   - Go to Authentication → Email Templates
   - Edit "Magic Link" template
   - Ensure it contains `{{ .ConfirmationURL }}`
   - Set redirect URL: `http://localhost:3000/auth/callback`

5. **Run the development server:**
   ```bash
   npm run dev
   ```

## ✨ Features

- **Magic Link Authentication** - Passwordless login via email
- **Groups** - Create and join reflection groups
- **Cadence Engine** - Automatic week assignments with 4 questions
- **Reflections** - Submit reflections with sentiment and assigned questions
- **Personal Journal** - View all your reflections across groups
- **Monthly Wrap** - Group summary with statistics and sentiment
- **Invite Links** - Shareable group invitations

## 📁 Project Structure

```
app/
  ├── auth/callback/          # Auth callback route handler
  ├── login/                 # Login page
  ├── me/                    # User profile page
  ├── journal/               # Personal journal view
  ├── groups/
  │   ├── [id]/             # Individual group page
  │   │   └── wrap/         # Monthly wrap page
  │   ├── create/           # Create group page
  │   ├── mine/             # User's groups
  │   └── page.tsx          # All groups listing
  └── api/
      └── groups/
          └── [id]/
              ├── join/      # Join group API route
              ├── leave/     # Leave group API route
              ├── reflect/   # Submit reflection API route
              └── cadence/   # Generate cadence API route

lib/
  ├── supabase-browser.ts   # Browser client (client components)
  ├── supabase-server.ts    # Server clients (SSR + API routes)
  ├── questions.ts           # 40-question deck
  └── cadence.ts            # Cadence engine

components/
  └── ui/                   # shadcn/ui components
```

## 🏗️ Architecture

### Supabase Client Architecture

This project uses **three types of Supabase clients**:

1. **`supabaseBrowser()`** - For Client Components (browser-only)
2. **`supabaseServer()`** - For Server Components (read-only, cannot write cookies)
3. **`supabaseServerAction()`** - For API Routes and Server Actions (read/write, can write cookies)

### Key Patterns

- **Server Components** for data fetching and rendering
- **API Route Handlers** for mutations (POST/PUT/DELETE)
- **Server Actions** for form submissions
- **Dynamic routes** use `params: Promise<{ id: string }>` (Next.js 15+)

## 🗄️ Database Schema

See `schema.sql` and `schema-migrations.sql` for complete setup. Key tables:

- `profiles` - User profiles (auto-created via trigger)
- `groups` - Reflection groups (with invite_token)
- `group_members` - Group membership
- `reflections` - Weekly reflections (with sentiment, questions, cadence)
- `cadence_assignments` - Monthly week assignments

## 🧪 Testing

```bash
# Test database connection
npm run test:db
```

See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for complete test scenarios.

## 📚 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - 15-minute setup guide
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Detailed setup instructions
- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Complete test scenarios
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Feature list and changes
- **[MIGRATION_INSTRUCTIONS.md](./MIGRATION_INSTRUCTIONS.md)** - Database migration details
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture and diagrams
- **[CONTEXT.md](./CONTEXT.md)** - Full context for AI assistants

## 🐛 Common Issues & Solutions

### "Cookies can only be modified in a Server Action or Route Handler"

**Solution**: Use `supabaseServerAction()` instead of `supabaseServer()` in API routes.

### "Missing tokens in callback"

**Solution**: Ensure you're using `/auth/callback/route.ts` (API route), not `page.tsx`.

### "params.id is a Promise"

**Solution**: In Next.js 15+, await params:
```ts
export async function POST(req, { params }) {
  const { id } = await params;
  // ...
}
```

### Magic link not working

**Solution**: 
- Verify email template contains `{{ .ConfirmationURL }}`
- Check redirect URL matches Supabase project settings
- Ensure callback route is at `/auth/callback/route.ts`

## 🚧 Roadmap

- [x] MVP Features (Complete!)
- [ ] Photo uploads in reflections
- [ ] Email notifications for assignments
- [ ] Export monthly wrap as PDF
- [ ] Advanced analytics
- [ ] Mobile app

## 📝 License

MIT
