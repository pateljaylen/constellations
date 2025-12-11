import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase-server";

export default async function MePage() {
  // MUST await the server client
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Welcome, {user.email}</h1>
      <p>Your user ID is: {user.id}</p>
    </div>
  );
}
