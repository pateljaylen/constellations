import { supabaseServer } from "@/lib/supabase-server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default async function GroupsIndexPage() {
  const supabase = await supabaseServer();

  // Fetch all groups
  const { data: groups } = await supabase
    .from("groups")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-3xl mx-auto p-10 space-y-6">
      <h1 className="text-3xl font-bold">All Groups</h1>

      {groups?.length ? (
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
                View Group →
              </Link>
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-zinc-500">No groups created yet.</p>
      )}
    </div>
  );
}
