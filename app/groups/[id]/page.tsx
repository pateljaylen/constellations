import { supabaseServer } from "@/lib/supabase-server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default async function GroupPage(props: { params: Promise<{ id: string }> }) {
  // ✅ Await params (Next.js 15+ requirement)
  const { id: groupId } = await props.params;

  // ✅ Always await supabaseServer() (cookie hydration)
  const supabase = await supabaseServer();

  // 1) Get logged-in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // 2) Fetch group
  const { data: group, error: groupErr } = await supabase
    .from("groups")
    .select("*")
    .eq("id", groupId)
    .single();

  if (!group || groupErr) {
    return (
      <div className="p-10">
        <h1 className="text-2xl font-bold">Group not found</h1>
      </div>
    );
  }

  // 3) Check membership
  const { data: membership } = await supabase
    .from("group_members")
    .select("*")
    .eq("group_id", groupId)
    .eq("user_id", user.id)
    .maybeSingle();

  const isMember = Boolean(membership);

  return (
    <div className="max-w-3xl mx-auto p-10">
      <Card>
        <CardHeader>
          <CardTitle>{group.name}</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-zinc-600 mb-4">{group.description}</p>

          {!isMember && (
            <form action={`/api/groups/${groupId}/join`} method="post">
              <Button type="submit">Join Group</Button>
            </form>
          )}

          {isMember && (
            <div className="mt-6 space-y-6">
              <h2 className="text-xl font-semibold">Your Reflections</h2>

              <Card className="p-4">
                <form action={`/api/groups/${groupId}/reflect`} method="post">
                  <textarea
                    name="content"
                    required
                    placeholder="Write your weekly reflection…"
                    className="w-full border rounded p-3 h-32"
                  />
                  <Button type="submit" className="mt-3">
                    Submit Reflection
                  </Button>
                </form>
              </Card>

              {/* Reflection list component */}
              <ReflectionsList groupId={groupId} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/** Server Component — list reflections */
async function ReflectionsList({ groupId }: { groupId: string }) {
  const supabase = await supabaseServer();

  const { data: reflections, error } = await supabase
    .from("reflections")
    .select(`
      id,
      content,
      created_at,
      user_id,
      users:user_id (
        email
      )
    `)
    .eq("group_id", groupId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ Error loading reflections:", error);
  }

  if (!reflections || reflections.length === 0) {
    return <p className="text-zinc-500">No reflections yet.</p>;
  }

  return (
    <div className="space-y-4">
      {reflections.map((r) => (
        <Card key={r.id}>
          <CardHeader>
            <CardTitle className="text-sm">
              <span className="font-semibold">{r.users?.email}</span> —{" "}
              {new Date(r.created_at).toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{r.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
