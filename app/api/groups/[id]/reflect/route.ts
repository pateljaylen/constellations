// app/api/groups/[id]/reflect/route.ts
import { NextResponse } from "next/server";
import { supabaseServerAction } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function POST(
  request: Request,
  context: { params: { id: string } }
) {
  // --- Extract group ID ---
  const groupId = context.params.id;

  console.log("🔍 Reflect API hit for group:", groupId);

  if (!groupId) {
    console.error("❌ Missing group ID");
    return NextResponse.json({ error: "Missing group ID" }, { status: 400 });
  }

  // --- Parse form body ---
  const form = await request.formData();
  const content = form.get("content") as string;

  if (!content) {
    console.error("❌ Missing reflection content");
    return NextResponse.json({ error: "Missing content" }, { status: 400 });
  }

  // --- Supabase auth & client ---
  const supabase = await supabaseServerAction();

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr || !user) {
    console.error("❌ Auth error:", userErr);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // --- Insert reflection ---
  const { error: insertErr } = await supabase.from("reflections").insert({
    group_id: groupId,
    user_id: user.id,
    content,
  });

  if (insertErr) {
    console.error("❌ Reflection insert error:", insertErr);
    return NextResponse.json({ error: insertErr.message }, { status: 400 });
  }

  console.log("✅ Reflection saved!");

  // --- Revalidate the group page ---
  revalidatePath(`/groups/${groupId}`);

  // --- Next.js requires ABSOLUTE URL redirects inside Route Handlers ---
  const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/groups/${groupId}`;

  return NextResponse.redirect(redirectUrl);
}
