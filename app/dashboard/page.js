import { getCurrentUser, getCurrentOrganization, getCurrentUserRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Calendar, Users, ArrowRight, Kanban } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import CreateProjectDialog from "@/components/create-project-dialog";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const organization = await getCurrentOrganization();
  const userRole = await getCurrentUserRole();

  if (!user || !organization) {
    redirect("/");
  }

  const projects = await db.project.findMany({
    where: { organizationId: organization.id },
    include: {
      sprints: {
        include: {
          _count: {
            select: { issues: true }
          }
        }
      },
      _count: {
        select: { sprints: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  const isAdmin = userRole === "ADMIN";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage your projects and track progress
          </p>
        </div>
        {isAdmin && <CreateProjectDialog />}
      </div>

      {projects.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Kanban className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
            <p className="text-muted-foreground mb-4">
              {isAdmin 
                ? "Create your first project to get started with Scrum"
                : "Ask an admin to create a project for you"
              }
            </p>
            {isAdmin && <CreateProjectDialog />}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                    {project.key}
                  </span>
                </div>
                <CardDescription>
                  {project.description || "No description"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {project._count.sprints} Sprints
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {project.sprints.reduce((acc, sprint) => acc + sprint._count.issues, 0)} Issues
                  </div>
                </div>
                
                <div className="space-y-2">
                  {project.sprints.slice(0, 3).map((sprint) => (
                    <div key={sprint.id} className="flex items-center justify-between text-sm">
                      <span className="truncate">{sprint.name}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        sprint.status === "ACTIVE" ? "bg-green-100 text-green-800" :
                        sprint.status === "COMPLETED" ? "bg-blue-100 text-blue-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {sprint.status}
                      </span>
                    </div>
                  ))}
                </div>

                <Link href={`/dashboard/projects/${project.id}`}>
                  <Button variant="outline" className="w-full mt-4">
                    View Project
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
