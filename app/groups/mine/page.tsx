import { supabaseServer } from "@/lib/supabase-server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function MyGroupsPage() {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch groups user belongs to
  const { data: memberships } = await supabase
    .from("group_members")
    .select("group_id, groups(*)")
    .eq("user_id", user.id);

  const groups = memberships?.map((m) => m.groups) ?? [];

  return (
    <div className="max-w-3xl mx-auto p-10 space-y-6">
      <h1 className="text-3xl font-bold">My Groups</h1>

      {groups.length ? (
        groups.map((group) => (
          <Card key={group.id}>
            <CardHeader>
              <CardTitle>{group.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-600 mb-3">{group.description}</p>
              <Link 
                href={`/groups/${group.id}`} 
                className="underline text-blue-600"
              >
                Enter Group →
              </Link>
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-zinc-500">You are not a member of any groups yet.</p>
      )}
    </div>
  );
}
