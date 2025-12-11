import { supabaseServer } from "@/lib/supabase-server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-3xl text-center">Constellation</CardTitle>
            <p className="text-center text-zinc-600 mt-2">
              A modern ritual for becoming human together.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/login" className="block">
              <Button className="w-full">Get Started</Button>
            </Link>
            <p className="text-sm text-center text-zinc-500">
              Join groups, reflect together, and grow as a community.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User is logged in, show dashboard
  const { data: myGroups } = await supabase
    .from("group_members")
    .select(`
      group_id,
      groups:group_id (
        id,
        name,
        description
      )
    `)
    .eq("user_id", user.id)
    .limit(5);

  const { data: recentReflections } = await supabase
    .from("reflections")
    .select(`
      id,
      content,
      created_at,
      groups:group_id (
        name
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <div className="max-w-6xl mx-auto p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
        <p className="text-zinc-600">Continue your journey of reflection and growth.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/groups/create">
              <Button variant="outline" className="w-full justify-start">
                Create Group
              </Button>
            </Link>
            <Link href="/groups">
              <Button variant="outline" className="w-full justify-start">
                Browse Groups
              </Button>
            </Link>
            <Link href="/journal">
              <Button variant="outline" className="w-full justify-start">
                View Journal
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Groups</CardTitle>
          </CardHeader>
          <CardContent>
            {!myGroups || myGroups.length === 0 ? (
              <p className="text-zinc-500 text-sm mb-4">You're not in any groups yet.</p>
            ) : (
              <div className="space-y-2">
                {myGroups.map((mg: any) => (
                  <Link
                    key={mg.group_id}
                    href={`/groups/${mg.groups?.id}`}
                    className="block p-2 rounded hover:bg-zinc-50"
                  >
                    <p className="font-medium">{mg.groups?.name}</p>
                    <p className="text-sm text-zinc-500">{mg.groups?.description}</p>
                  </Link>
                ))}
              </div>
            )}
            <Link href="/groups/mine" className="block mt-4">
              <Button variant="link" className="p-0">
                View all groups →
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {recentReflections && recentReflections.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Reflections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReflections.map((r: any) => (
                <div key={r.id} className="border-b border-zinc-200 pb-4 last:border-0">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium">{r.groups?.name}</p>
                    <p className="text-sm text-zinc-500">
                      {new Date(r.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-sm text-zinc-600 line-clamp-2">{r.content}</p>
                </div>
              ))}
            </div>
            <Link href="/journal" className="block mt-4">
              <Button variant="link" className="p-0">
                View all reflections →
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
