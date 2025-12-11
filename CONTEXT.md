# 🧠 Constellation - Full Context Pack for AI Assistants

**This file contains everything an AI assistant needs to understand the Constellation project architecture, decisions, and current state.**

---

## ✅ 1. Project Overview

**Constellation** is a web application for group-based weekly reflections.

**Core Features:**
- Magic link authentication (Supabase)
- User accounts (Supabase auth + profiles table)
- Groups (users can create and join)
- Reflections (users submit weekly reflections within a group)
- UI built with Next.js App Router + shadcn/ui

**Architecture Status:** ✅ **WORKING** - Login, logout, group listing, joining groups, and reflection submission all functional.

---

## ✅ 2. Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Authentication**: Supabase Auth (Magic Links with PKCE)
- **Database**: Supabase (PostgreSQL)
- **UI Library**: shadcn/ui
- **Styling**: Tailwind CSS
- **Language**: TypeScript

---

## ✅ 3. Folder Structure

```
app/
  ├── login/
  │   └── page.tsx                    # Login page (client component)
  ├── auth/
  │   └── callback/
  │       └── route.ts                # Auth callback API route (NOT page.tsx)
  ├── me/
  │   ├── page.tsx                    # User profile page
  │   └── ClientActions.tsx           # Logout button (client component)
  ├── groups/
  │   ├── page.tsx                    # All groups listing
  │   ├── mine/
  │   │   └── page.tsx                # User's groups
  │   ├── create/
  │   │   ├── page.tsx                # Create group page
  │   │   └── actions.tsx             # Server action for group creation
  │   └── [id]/
  │       └── page.tsx                # Individual group page
  └── api/
      └── groups/
          ├── create/
          │   └── route.ts            # Create group API route
          └── [id]/
              ├── join/
              │   └── route.ts        # Join group API route
              └── reflect/
                  └── route.ts        # Submit reflection API route

lib/
  ├── supabase-browser.ts             # Browser client (client components)
  └── supabase-server.ts              # Server clients (SSR + API routes)

components/
  └── ui/                              # shadcn/ui components
      ├── button.tsx
      ├── card.tsx
      ├── input.tsx
      └── separator.tsx
```

---

## ✅ 4. Supabase Client Architecture (CRITICAL)

This project uses **three different Supabase clients** for different contexts:

### A) `supabaseBrowser()` - Browser Client

**Location**: `lib/supabase-browser.ts`

**Usage**: Client Components only (`"use client"`)

```ts
import { createBrowserClient } from "@supabase/ssr";

export function supabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

**When to use**: Login forms, client-side auth checks, browser-only operations.

---

### B) `supabaseServer()` - Server Component Client (READ-ONLY)

**Location**: `lib/supabase-server.ts`

**Usage**: Server Components for data fetching

**Key characteristic**: **CANNOT write cookies** (read-only cookie access)

```ts
export async function supabaseServer() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        // NO set() or remove() - read-only!
      },
    }
  );
}
```

**When to use**: 
- Server Components that fetch data
- Pages that display user info, groups, reflections
- Any server-side data reading

**Example**:
```ts
// app/groups/[id]/page.tsx
export default async function GroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await supabaseServer(); // ✅ Correct
  const { data } = await supabase.from("groups").select("*").eq("id", id).single();
  // ...
}
```

---

### C) `supabaseServerAction()` - API Route & Server Action Client (READ/WRITE)

**Location**: `lib/supabase-server.ts`

**Usage**: API Route Handlers and Server Actions

**Key characteristic**: **CAN write cookies** (full cookie access)

```ts
export async function supabaseServerAction() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set(name, value, options);
        },
        remove(name: string, options: any) {
          cookieStore.set(name, "", { ...options, maxAge: 0 });
        },
      },
    }
  );
}
```

**When to use**:
- API Route Handlers (`app/api/**/route.ts`)
- Server Actions (`"use server"`)
- Auth callback route
- Any mutation that needs to write cookies

**Example**:
```ts
// app/api/groups/[id]/join/route.ts
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const supabase = await supabaseServerAction(); // ✅ Correct
  const { data: { user } } = await supabase.auth.getUser();
  // ...
}
```

---

## ⚠️ CRITICAL RULE: Client Selection

| Context | Use This Client | Why |
|---------|----------------|-----|
| Client Component | `supabaseBrowser()` | Browser-only |
| Server Component (data fetching) | `supabaseServer()` | Read-only, prevents cookie errors |
| API Route Handler | `supabaseServerAction()` | Can write cookies |
| Server Action | `supabaseServerAction()` | Can write cookies |
| Auth Callback | `supabaseServerAction()` | Must write session cookies |

**Common mistake**: Using `supabaseServer()` in API routes → causes "Cookies can only be modified" error.

---

## ✅ 5. Authentication Flow

### Login Process

1. **User enters email** on `/login` page
2. **Client component calls**:
   ```ts
   supabaseBrowser().auth.signInWithOtp({
     email,
     options: {
       shouldCreateUser: true,
       emailRedirectTo: `${window.location.origin}/auth/callback`
     }
   })
   ```
3. **Supabase sends magic link** to user's email
4. **User clicks link** → redirected to `/auth/callback?code=...`
5. **Callback route** (`app/auth/callback/route.ts`):
   - Extracts `code` from URL
   - Calls `supabase.auth.exchangeCodeForSession(code)`
   - Sets session cookies via `supabaseServerAction()`
   - Redirects to `/me`

### Supabase Email Template Configuration

**CRITICAL**: The magic link email template must contain:

```
{{ .ConfirmationURL }}
```

This resolves to:
```
https://PROJECT.supabase.co/auth/v1/verify?token=...&type=magiclink&redirect_to=http://localhost:3000/auth/callback
```

**Settings**:
- Redirect URL in Supabase dashboard must match: `http://localhost:3000/auth/callback` (or production URL)
- Callback route must be at `/app/auth/callback/route.ts` (API route, NOT page.tsx)

---

## ✅ 6. Database Schema

### Tables

#### `profiles`
- Auto-created via trigger when user signs up
- Uses `auth.uid()` as primary key
- Foreign key to `auth.users`

#### `groups`
```sql
id uuid primary key default uuid_generate_v4()
name text not null
description text
creator_id uuid references profiles(id)
created_at timestamptz default now()
```

#### `group_members`
```sql
group_id uuid references groups(id) on delete cascade
user_id uuid references profiles(id) on delete cascade
unique (group_id, user_id)
```

#### `reflections`
```sql
id uuid primary key default uuid_generate_v4()
group_id uuid not null references groups(id) on delete cascade
user_id uuid not null references profiles(id) on delete cascade
content text not null
created_at timestamptz default now()
```

**See `schema.sql` for complete setup including triggers and RLS policies.**

---

## ✅ 7. Key Patterns & Conventions

### Dynamic Routes (Next.js 15+)

**CRITICAL**: In Next.js 15+, `params` is a Promise and must be awaited:

```ts
// ✅ Correct
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // ...
}

// ✅ Correct (API Route)
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const groupId = params.id; // Already unwrapped in API routes
  // ...
}
```

### API Route Handlers

**Pattern**: All mutations go through API Route Handlers

```ts
// app/api/groups/[id]/join/route.ts
export async function POST(
  request: Request,
  context: { params: { id: string } }
) {
  const groupId = context.params.id;
  const supabase = await supabaseServerAction();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  // Mutation logic...
  
  return NextResponse.redirect(new URL(`/groups/${groupId}`, request.url));
}
```

### Server Actions

**Pattern**: Alternative to API routes for form submissions

```ts
// app/groups/create/actions.tsx
"use server";

export async function createGroup(formData: FormData) {
  const supabase = await supabaseServerAction();
  // ...
  redirect(`/groups/${group.id}`);
}
```

### Data Fetching in Server Components

**Pattern**: Use `supabaseServer()` for all reads

```ts
export default async function GroupsPage() {
  const supabase = await supabaseServer();
  const { data: groups } = await supabase.from("groups").select("*");
  // ...
}
```

---

## ✅ 8. Problems Encountered & Fixes

### Problem: Magic link missing query params
**Cause**: Wrong email template configuration  
**Fix**: Reset template, use `{{ .ConfirmationURL }}`, create new Supabase project if needed

### Problem: "Missing tokens in callback"
**Cause**: Using `/auth/callback/page.tsx` instead of `route.ts`  
**Fix**: Use API route handler (`route.ts`)

### Problem: Supabase PKCE verifier mismatch
**Cause**: Stale project state  
**Fix**: Created new Supabase project

### Problem: "Cookies can only be modified in a Server Action or Route Handler"
**Cause**: Using `supabaseServer()` in API route  
**Fix**: Use `supabaseServerAction()` in API routes and Server Actions

### Problem: "params.id is a Promise"
**Cause**: Incorrect route signature in Next.js 15+  
**Fix**: Await params in Server Components, use correct signature in API routes

### Problem: Reflection not saving group_id
**Cause**: Route folder structure wrong  
**Fix**: Place reflect handler inside `[id]` folder: `app/api/groups/[id]/reflect/route.ts`

### Problem: User authed on /me but not in /groups/[id]
**Cause**: Server client wasn't awaited  
**Fix**: `const supabase = await supabaseServer();`

### Problem: Reflections not showing
**Cause**: Missing foreign keys, wrong query structure  
**Fix**: Added FK constraints, fixed query to join with profiles

---

## ✅ 9. Current Working State

✅ Login works  
✅ Magic link works  
✅ Auth callback works  
✅ Session persists on refresh  
✅ Groups listing works (`/groups`)  
✅ My groups works (`/groups/mine`)  
✅ Create group works  
✅ Join group works  
✅ Reflection submission works  
✅ Reflections display works  
✅ Navigation works  

---

## ✅ 10. Environment Variables

Required `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

---

## ✅ 11. Mental Model for AI Assistants

When building features or fixing bugs, remember:

1. **Next.js App Router** - Server Components by default
2. **Supabase SSR v2** (`@supabase/ssr`) - Cookie-based sessions
3. **Two server clients** - One read-only, one read/write
4. **Mutations** → API Routes or Server Actions (use `supabaseServerAction()`)
5. **Data fetching** → Server Components (use `supabaseServer()`)
6. **Dynamic routes** → `params` is Promise in Server Components, unwrapped in API routes
7. **Auth session** → Stored in cookies, read via server client
8. **User profiles** → Auto-created via trigger on signup
9. **Groups & Reflections** → Use dynamic route params `[id]`
10. **API routes** → Must use `export async function POST(req, { params })` signature

---

## 🚧 12. Remaining Tasks

- [ ] Improve reflections UI
- [ ] Add group leave button
- [ ] Restrict reflections to one per week (optional)
- [ ] Group invite links
- [ ] User settings page
- [ ] Email verification UX improvements

---

## 📚 Related Files

- `README.md` - User-facing documentation
- `ARCHITECTURE.md` - Architecture diagrams and patterns
- `schema.sql` - Complete database setup

---

**Last Updated**: Based on working state as of project completion

