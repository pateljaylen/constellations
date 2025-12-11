"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function LoginPage() {
  const [email, setEmail] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    const supabase = supabaseBrowser();

    await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    alert("Magic link sent — check your email.");
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleLogin} className="flex flex-col gap-4 w-80">
        <input
          type="email"
          placeholder="you@example.com"
          className="border p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className="bg-black text-white py-2">Send Magic Link</button>
      </form>
    </div>
  );
}
