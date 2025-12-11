// /app/auth/callback/route.ts
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  console.log("👉 Callback hit:", request.url);

  const url = new URL(request.url);

  // Magic link uses either `code` or `token` param
  const code = url.searchParams.get("code") ?? url.searchParams.get("token");
  console.log("👉 Extracted code:", code);

  if (!code) {
    console.error("❌ No code found in callback URL");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // IMPORTANT: Next.js 16 requires awaiting cookies()
  const cookieStore = await cookies();

  // Correct Next.js 16 cookie adapter
  const supabase = createServerClient(
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

  console.log("👉 Exchanging code for session…");

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  console.log("👉 Exchange result:", data, error);

  if (error || !data.session) {
    console.error("❌ Supabase error:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }

  console.log("✅ Auth success! User:", data.user.id);

  return NextResponse.redirect(new URL("/me", request.url));
}
