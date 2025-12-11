import { supabaseServer } from "@/lib/supabase-server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function InvitePage(props: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await props.params;
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Redirect to login with return URL
    redirect(`/login?redirect=/invite/${token}`);
  }

  // Find group by invite token
  const { data: group, error: groupErr } = await supabase
    .from("groups")
    .select("*")
    .eq("invite_token", token)
    .single();

  if (!group || groupErr) {
    return (
      <div className="max-w-2xl mx-auto p-10">
        <Card>
          <CardContent className="p-10 text-center">
            <h1 className="text-2xl font-bold mb-4">Invalid Invite Link</h1>
            <p className="text-zinc-600 mb-4">
              This invite link is invalid or has expired.
            </p>
            <Link href="/groups">
              <Button>Browse Groups</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if user is already a member
  const { data: membership } = await supabase
    .from("group_members")
    .select("*")
    .eq("group_id", group.id)
    .eq("user_id", user.id)
    .maybeSingle();

  const isMember = Boolean(membership);

  return (
    <div className="max-w-2xl mx-auto p-10">
      <Card>
        <CardHeader>
          <CardTitle>You've been invited to join</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">{group.name}</h2>
            {group.description && (
              <p className="text-zinc-600">{group.description}</p>
            )}
          </div>

          {isMember ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded">
              <p className="text-green-700 mb-3">
                You're already a member of this group!
              </p>
              <Link href={`/groups/${group.id}`}>
                <Button>Go to Group</Button>
              </Link>
            </div>
          ) : (
            <form action={`/api/groups/${group.id}/join`} method="post">
              <Button type="submit" className="w-full">
                Join Group
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

