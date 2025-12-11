# Constellation

A web application for group-based weekly reflections, built with Next.js and Supabase.

> **Note**: This repository contains both the working Next.js application and the original product vision/planning documentation. See the `docs/`, `product-spec/`, and other documentation folders for the original product vision and design documents.

## 🚀 Features

- **Magic Link Authentication** - Passwordless login via email
- **Groups** - Create and join reflection groups
- **Weekly Reflections** - Submit and view reflections within groups
- **User Profiles** - Automatic profile creation on signup

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Authentication**: Supabase Auth (Magic Links)
- **Database**: Supabase (PostgreSQL)
- **UI**: shadcn/ui + Tailwind CSS
- **Language**: TypeScript

## 📋 Prerequisites

- Node.js 18+ 
- npm/yarn/pnpm
- Supabase account and project

## 🔧 Setup

1. **Clone and install dependencies:**

```bash
npm install
```

2. **Set up environment variables:**

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

3. **Set up Supabase database:**

Run the SQL schema from `schema.sql` in your Supabase SQL editor to create the necessary tables and triggers.

4. **Configure Supabase Email Template:**

In your Supabase dashboard:
- Go to Authentication → Email Templates
- Edit the "Magic Link" template
- Ensure it contains `{{ .ConfirmationURL }}` in the link
- Set the redirect URL to: `http://localhost:3000/auth/callback` (or your production URL)

5. **Run the development server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
app/
  ├── auth/
  │   └── callback/          # Auth callback route handler
  ├── login/                 # Login page
  ├── me/                    # User profile page
  ├── groups/
  │   ├── [id]/             # Individual group page
  │   ├── create/           # Create group page
  │   ├── mine/             # User's groups
  │   └── page.tsx          # All groups listing
  └── api/
      └── groups/
          └── [id]/
              ├── join/      # Join group API route
              └── reflect/   # Submit reflection API route

lib/
  ├── supabase-browser.ts   # Browser client (client components)
  └── supabase-server.ts    # Server clients (SSR + API routes)

components/
  └── ui/                   # shadcn/ui components
```

## 🏗️ Architecture

### Supabase Client Architecture

This project uses **two types of Supabase server clients**:

1. **`supabaseServer()`** - For Server Components (read-only)
   - Cannot write cookies
   - Use for data fetching in Server Components

2. **`supabaseServerAction()`** - For API Routes and Server Actions (read/write)
   - Can write cookies
   - Use for mutations and auth operations

3. **`supabaseBrowser()`** - For Client Components
   - Browser-side client
   - Use in `"use client"` components

### Key Patterns

- **Server Components** for data fetching and rendering
- **API Route Handlers** for mutations (POST/PUT/DELETE)
- **Server Actions** for form submissions
- **Dynamic routes** use `params: Promise<{ id: string }>` (Next.js 15+)

## 🗄️ Database Schema

See `schema.sql` for the complete database setup. Key tables:

- `profiles` - User profiles (auto-created via trigger)
- `groups` - Reflection groups
- `group_members` - Group membership
- `reflections` - Weekly reflections

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

## 📚 Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Detailed architecture and mental model
- [CONTEXT.md](./CONTEXT.md) - Full context for AI assistants
- [schema.sql](./schema.sql) - Database schema

## 🚧 Roadmap

- [ ] Improve reflections UI
- [ ] Add group leave functionality
- [ ] Restrict reflections to one per week
- [ ] Group invite links
- [ ] User settings page
- [ ] Email verification UX improvements

## 📝 License

MIT
