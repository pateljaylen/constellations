import { supabaseServer } from "@/lib/supabase-server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default async function CreateGroupPage() {
  const supabase = await supabaseServer();

  // Ensure user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="max-w-lg mx-auto p-10">
      <Card>
        <CardHeader>
          <CardTitle>Create a Group</CardTitle>
        </CardHeader>

        <CardContent>
          <form action="/api/groups/create" method="post" className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Group Name</label>
              <Input type="text" name="name" required />
            </div>

            <div>
              <label className="block text-sm mb-1">Description</label>
              <Input type="text" name="description" required />
            </div>

            <Button type="submit" className="w-full">
              Create Group
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
