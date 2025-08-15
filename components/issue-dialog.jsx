"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Save, X, User, Calendar, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { updateIssue, getOrganizationUsers } from "@/lib/actions";

const issueSchema = z.object({
  title: z.string().min(1, "Issue title is required").max(200, "Issue title must be less than 200 characters"),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  assigneeId: z.string().optional(),
});

const priorityColors = {
  LOW: "bg-blue-100 text-blue-800",
  MEDIUM: "bg-yellow-100 text-yellow-800",
  HIGH: "bg-orange-100 text-orange-800",
  URGENT: "bg-red-100 text-red-800",
};

export default function IssueDialog({ issue, open, onOpenChange, project, isAdmin }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      title: issue.title,
      description: issue.description || "",
      priority: issue.priority,
      assigneeId: issue.assigneeId || "",
    },
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const orgUsers = await getOrganizationUsers();
        setUsers(orgUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    if (open) {
      fetchUsers();
    }
  }, [open]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      await updateIssue(issue.id, data);
      toast.success("Issue updated successfully!");
      setIsEditing(false);
      // Refresh the page to show the updated issue
      window.location.reload();
    } catch (error) {
      toast.error(error.message || "Failed to update issue");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    reset({
      title: issue.title,
      description: issue.description || "",
      priority: issue.priority,
      assigneeId: issue.assigneeId || "",
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">
                {isEditing ? "Edit Issue" : issue.title}
              </DialogTitle>
              <DialogDescription>
                {!isEditing && `Issue in ${project.key}-${issue.id.slice(-4)}`}
              </DialogDescription>
            </div>
            {isAdmin && !isEditing && (
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            )}
          </div>
        </DialogHeader>

        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Issue Title</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="Enter issue title"
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Enter issue description"
                rows={4}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Priority</Label>
                <Controller
                  name="priority"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(priorityColors).map(([priority, colorClass]) => (
                          <SelectItem key={priority} value={priority}>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded-full text-xs ${colorClass}`}>
                                {priority}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Assignee</Label>
                <Controller
                  name="assigneeId"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select assignee">
                          {field.value && users.find(u => u.id === field.value) && (
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={users.find(u => u.id === field.value)?.imageUrl} />
                                <AvatarFallback>
                                  {users.find(u => u.id === field.value)?.firstName?.[0] || "U"}
                                </AvatarFallback>
                              </Avatar>
                              <span>
                                {users.find(u => u.id === field.value)?.firstName} {users.find(u => u.id === field.value)?.lastName}
                              </span>
                            </div>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Unassigned</SelectItem>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={user.imageUrl} />
                                <AvatarFallback>
                                  {user.firstName?.[0] || user.email[0]?.toUpperCase() || "U"}
                                </AvatarFallback>
                              </Avatar>
                              <span>
                                {user.firstName} {user.lastName}
                                {!user.firstName && user.email}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="space-y-6">
            {/* Issue Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Badge 
                  variant="outline" 
                  className={`text-sm ${priorityColors[issue.priority]}`}
                >
                  {issue.priority}
                </Badge>
                <Badge variant="secondary">
                  {issue.status}
                </Badge>
              </div>
              
              {issue.description && (
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <div className="bg-muted p-3 rounded-md">
                    <p className="whitespace-pre-wrap">{issue.description}</p>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Assignee</p>
                    {issue.assignee ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={issue.assignee.imageUrl} />
                          <AvatarFallback>
                            {issue.assignee.firstName?.[0] || issue.assignee.email[0]?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">
                          {issue.assignee.firstName} {issue.assignee.lastName}
                          {!issue.assignee.firstName && issue.assignee.email}
                        </span>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Unassigned</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Created</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(issue.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
