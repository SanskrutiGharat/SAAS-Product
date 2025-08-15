import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Kanban, Users, Calendar, Zap, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

export default async function HomePage() {
  const { userId } = await auth();

  // If user is authenticated, redirect to dashboard
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Kanban className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">Scrum</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/sign-in">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <Badge variant="secondary" className="text-sm">
              Professional Project Management
            </Badge>
            <h1 className="text-5xl font-bold tracking-tight">
              Manage Projects Like a
              <span className="text-primary"> Pro</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Scrum is a powerful project management platform inspired by Jira. 
              Organize work, track progress, and deliver results with our intuitive 
              Kanban board and sprint management tools.
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-4">
            <Link href="/sign-up">
              <Button size="lg" className="text-lg px-8 py-6">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to streamline your project management workflow
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="text-center p-6">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Kanban className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="mb-2">Kanban Board</CardTitle>
            <CardDescription>
              Visualize your workflow with our intuitive drag-and-drop Kanban board. 
              Move issues between columns and track progress in real-time.
            </CardDescription>
          </Card>

          <Card className="text-center p-6">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Calendar className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="mb-2">Sprint Management</CardTitle>
            <CardDescription>
              Plan and execute sprints with ease. Set start and end dates, 
              track sprint status, and manage your development cycles effectively.
            </CardDescription>
          </Card>

          <Card className="text-center p-6">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="mb-2">Team Collaboration</CardTitle>
            <CardDescription>
              Work together seamlessly with role-based access control, 
              user assignments, and real-time updates across your organization.
            </CardDescription>
          </Card>

          <Card className="text-center p-6">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Zap className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="mb-2">Lightning Fast</CardTitle>
            <CardDescription>
              Built with Next.js and modern web technologies for 
              exceptional performance and user experience.
            </CardDescription>
          </Card>

          <Card className="text-center p-6">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="mb-2">Enterprise Ready</CardTitle>
            <CardDescription>
              Secure authentication, role-based permissions, and 
              scalable architecture for teams of any size.
            </CardDescription>
          </Card>

          <Card className="text-center p-6">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <ArrowRight className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="mb-2">Easy Integration</CardTitle>
            <CardDescription>
              Seamlessly integrate with your existing workflow. 
              Import data, export reports, and connect with your favorite tools.
            </CardDescription>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center">
          <Card className="max-w-2xl mx-auto p-8">
            <CardHeader>
              <CardTitle className="text-2xl">Ready to Get Started?</CardTitle>
              <CardDescription>
                Join thousands of teams already using Scrum to manage their projects effectively.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/sign-up">
                <Button size="lg" className="w-full">
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 Scrum. Built with Next.js, Clerk, and Prisma.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
