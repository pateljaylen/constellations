import { supabaseServer } from "@/lib/supabase-server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function GroupsIndexPage() {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // Fetch all groups
  const { data: groups } = await supabase
    .from("groups")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-4xl mx-auto p-10 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">All Groups</h1>
        <Link href="/groups/create">
          <Button>Create Group</Button>
        </Link>
      </div>

      {groups?.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {groups.map((group) => (
            <Card key={group.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{group.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-600 mb-4 line-clamp-2">{group.description}</p>
                <Link href={`/groups/${group.id}`}>
                  <Button variant="outline" className="w-full">
                    View Group
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-10 text-center">
            <p className="text-zinc-500 mb-4">No groups created yet.</p>
            <Link href="/groups/create">
              <Button>Create Your First Group</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
