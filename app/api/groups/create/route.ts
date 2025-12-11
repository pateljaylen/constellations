import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(request: Request) {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect("/login");
  }

  const formData = await request.formData();
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  const { data, error } = await supabase
    .from("groups")
    .insert({
      name,
      description,
      creator_id: user.id,
    })
    .select()
    .single();

  if (error) {
    console.error("Group create error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.redirect(`/groups/${data.id}`);
}
