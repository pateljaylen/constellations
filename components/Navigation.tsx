import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navigation() {
  return (
    <nav className="border-b border-zinc-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold">
              Constellation
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link href="/groups" className="text-zinc-600 hover:text-zinc-900">
                Groups
              </Link>
              <Link href="/groups/mine" className="text-zinc-600 hover:text-zinc-900">
                My Groups
              </Link>
              <Link href="/journal" className="text-zinc-600 hover:text-zinc-900">
                Journal
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/me">
              <Button variant="outline" size="sm">
                Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

