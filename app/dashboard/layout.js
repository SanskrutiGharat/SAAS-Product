import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Plus, Kanban, Calendar, Users, Settings } from "lucide-react";
import Link from "next/link";
import { getCurrentUser, getCurrentOrganization } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }) {
  const user = await getCurrentUser();
  const organization = await getCurrentOrganization();

  if (!user) {
    redirect("/sign-in");
  }

  if (!organization) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="flex h-16 items-center px-4 gap-4">
          <div className="flex items-center gap-2">
            <Kanban className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Scrum</span>
          </div>
          
          <OrganizationSwitcher 
            hidePersonal
            appearance={{
              elements: {
                rootBox: "ml-auto",
                organizationSwitcherTrigger: "h-9 px-3 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
              }
            }}
          />
          
          <UserButton 
            appearance={{
              elements: {
                userButtonAvatarBox: "h-9 w-9"
              }
            }}
          />
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-card/50 min-h-[calc(100vh-4rem)] p-4">
          <nav className="space-y-2">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                {organization.name}
              </h2>
              <div className="space-y-1">
                <Link href="/dashboard">
                  <Button variant="ghost" className="w-full justify-start">
                    <Kanban className="mr-2 h-4 w-4" />
                    Projects
                  </Button>
                </Link>
                <Link href="/dashboard/sprints">
                  <Button variant="ghost" className="w-full justify-start">
                    <Calendar className="mr-2 h-4 w-4" />
                    Sprints
                  </Button>
                </Link>
                <Link href="/dashboard/team">
                  <Button variant="ghost" className="w-full justify-start">
                    <Users className="mr-2 h-4 w-4" />
                    Team
                  </Button>
                </Link>
                <Link href="/dashboard/settings">
                  <Button variant="ghost" className="w-full justify-start">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </Link>
              </div>
            </div>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
