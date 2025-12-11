// app/api/groups/[id]/leave/route.ts
import { NextResponse } from "next/server";
import { supabaseServerAction } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function POST(
  request: Request,
  context: { params: { id: string } }
) {
  // Extract group ID with fallback to URL parsing
  let groupId = context.params?.id;
  
  if (!groupId) {
    const url = new URL(request.url);
    const pathMatch = url.pathname.match(/\/groups\/([^/]+)\/leave/);
    if (pathMatch) {
      groupId = pathMatch[1];
    }
  }

  if (!groupId) {
    return NextResponse.json({ error: "Missing group ID" }, { status: 400 });
  }

  const supabase = await supabaseServerAction();

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Remove user from group
  const { error: leaveErr } = await supabase
    .from("group_members")
    .delete()
    .eq("group_id", groupId)
    .eq("user_id", user.id);

  if (leaveErr) {
    console.error("❌ Leave group error:", leaveErr);
    return NextResponse.json({ error: leaveErr.message }, { status: 400 });
  }

  // Revalidate pages
  revalidatePath(`/groups/${groupId}`);
  revalidatePath("/groups/mine");

  const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/groups`;

  return NextResponse.redirect(redirectUrl);
}

