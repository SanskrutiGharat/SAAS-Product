import { getProject, getCurrentUserRole } from "@/lib/actions";
import { getCurrentUser, getCurrentOrganization } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Users, ArrowLeft } from "lucide-react";
import Link from "next/link";
import CreateSprintDialog from "@/components/create-sprint-dialog";
import CreateIssueDialog from "@/components/create-issue-dialog";
import KanbanBoard from "@/components/kanban-board";

export default async function ProjectPage({ params }) {
  const user = await getCurrentUser();
  const organization = await getCurrentOrganization();
  const userRole = await getCurrentUserRole();

  if (!user || !organization) {
    redirect("/");
  }

  const project = await getProject(params.projectId);
  const isAdmin = userRole === "ADMIN";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
          <p className="text-muted-foreground">
            Project Key: <span className="font-mono">{project.key}</span>
          </p>
          {project.description && (
            <p className="text-muted-foreground mt-2">{project.description}</p>
          )}
        </div>
        {isAdmin && <CreateSprintDialog projectId={project.id} />}
      </div>

      {/* Sprints */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Sprints</h2>
        </div>

        {project.sprints.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No sprints yet</h3>
              <p className="text-muted-foreground mb-4">
                {isAdmin 
                  ? "Create your first sprint to start organizing work"
                  : "Ask an admin to create a sprint for you"
                }
              </p>
              {isAdmin && <CreateSprintDialog projectId={project.id} />}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {project.sprints.map((sprint) => (
              <Card key={sprint.id} className="overflow-hidden">
                <CardHeader className="bg-muted/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{sprint.name}</CardTitle>
                      <CardDescription>
                        {new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        sprint.status === "ACTIVE" ? "default" :
                        sprint.status === "COMPLETED" ? "secondary" :
                        "outline"
                      }>
                        {sprint.status}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        {sprint.issues.length} issues
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <KanbanBoard 
                    sprint={sprint} 
                    project={project}
                    isAdmin={isAdmin}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
