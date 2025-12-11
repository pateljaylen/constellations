import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(
  request: Request,
  context: { params: { id: string } }
) {
  const groupId = context.params.id;

  if (!groupId) {
    console.error("❌ Missing groupId in route params");
    return NextResponse.json(
      { error: "Missing groupId" },
      { status: 400 }
    );
  }

  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect("/login");
  }

  const { error } = await supabase
    .from("group_members")
    .insert({
      group_id: groupId,
      user_id: user.id,
    });

  if (error) {
    console.error("❌ Join group error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.redirect(`/groups/${groupId}`);
}
