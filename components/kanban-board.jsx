"use client";

import { useState, useMemo } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Filter, User, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { updateIssueOrder, updateIssueStatus } from "@/lib/actions";
import CreateIssueDialog from "./create-issue-dialog";
import IssueDialog from "./issue-dialog";

const statusConfig = {
  TODO: {
    title: "To Do",
    color: "bg-gray-100 text-gray-800",
    bgColor: "bg-gray-50",
  },
  IN_PROGRESS: {
    title: "In Progress",
    color: "bg-blue-100 text-blue-800",
    bgColor: "bg-blue-50",
  },
  IN_REVIEW: {
    title: "In Review",
    color: "bg-yellow-100 text-yellow-800",
    bgColor: "bg-yellow-50",
  },
  DONE: {
    title: "Done",
    color: "bg-green-100 text-green-800",
    bgColor: "bg-green-50",
  },
};

const priorityColors = {
  LOW: "bg-blue-100 text-blue-800",
  MEDIUM: "bg-yellow-100 text-yellow-800",
  HIGH: "bg-orange-100 text-orange-800",
  URGENT: "bg-red-100 text-red-800",
};

export default function KanbanBoard({ sprint, project, isAdmin }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [selectedIssue, setSelectedIssue] = useState(null);

  // Get unique assignees and priorities for filters
  const assignees = useMemo(() => {
    const uniqueAssignees = [...new Set(sprint.issues.map(issue => issue.assigneeId).filter(Boolean))];
    return uniqueAssignees.map(id => sprint.issues.find(issue => issue.assigneeId === id)?.assignee);
  }, [sprint.issues]);

  const priorities = useMemo(() => {
    return [...new Set(sprint.issues.map(issue => issue.priority))];
  }, [sprint.issues]);

  // Filter issues based on search and filters
  const filteredIssues = useMemo(() => {
    return sprint.issues.filter(issue => {
      const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (issue.description && issue.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesAssignee = !assigneeFilter || issue.assigneeId === assigneeFilter;
      const matchesPriority = !priorityFilter || issue.priority === priorityFilter;
      
      return matchesSearch && matchesAssignee && matchesPriority;
    });
  }, [sprint.issues, searchTerm, assigneeFilter, priorityFilter]);

  // Group issues by status
  const issuesByStatus = useMemo(() => {
    const grouped = {
      TODO: [],
      IN_PROGRESS: [],
      IN_REVIEW: [],
      DONE: [],
    };

    filteredIssues.forEach(issue => {
      if (grouped[issue.status]) {
        grouped[issue.status].push(issue);
      }
    });

    // Sort by order within each status
    Object.keys(grouped).forEach(status => {
      grouped[status].sort((a, b) => a.order - b.order);
    });

    return grouped;
  }, [filteredIssues]);

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    const newStatus = destination.droppableId;
    const newOrder = destination.index + 1;

    try {
      await updateIssueOrder(draggableId, newStatus, newOrder);
      toast.success("Issue moved successfully!");
    } catch (error) {
      toast.error("Failed to move issue");
      console.error("Drag error:", error);
    }
  };

  const handleIssueClick = (issue) => {
    setSelectedIssue(issue);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setAssigneeFilter("");
    setPriorityFilter("");
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center p-4 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search issues..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All assignees" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All assignees</SelectItem>
              {assignees.map((assignee) => (
                <SelectItem key={assignee.id} value={assignee.id}>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-4 w-4">
                      <AvatarImage src={assignee.imageUrl} />
                      <AvatarFallback>
                        {assignee.firstName?.[0] || assignee.email[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span>
                      {assignee.firstName} {assignee.lastName}
                      {!assignee.firstName && assignee.email}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-muted-foreground" />
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="All priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All priorities</SelectItem>
              {priorities.map((priority) => (
                <SelectItem key={priority} value={priority}>
                  <span className={`px-2 py-1 rounded-full text-xs ${priorityColors[priority]}`}>
                    {priority}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {(searchTerm || assigneeFilter || priorityFilter) && (
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear filters
          </Button>
        )}
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(statusConfig).map(([status, config]) => (
            <div key={status} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm">{config.title}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {issuesByStatus[status]?.length || 0}
                  </Badge>
                </div>
                {isAdmin && (
                  <CreateIssueDialog sprintId={sprint.id} status={status} />
                )}
              </div>

              <Droppable droppableId={status}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[200px] p-2 rounded-lg transition-colors ${
                      snapshot.isDraggingOver ? "bg-muted" : config.bgColor
                    }`}
                  >
                    {issuesByStatus[status]?.map((issue, index) => (
                      <Draggable key={issue.id} draggableId={issue.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`mb-3 cursor-pointer transition-shadow ${
                              snapshot.isDragging ? "shadow-lg" : "hover:shadow-md"
                            }`}
                            onClick={() => handleIssueClick(issue)}
                          >
                            <Card className="bg-white">
                              <CardContent className="p-3">
                                <div className="space-y-2">
                                  <div className="flex items-start justify-between gap-2">
                                    <h4 className="font-medium text-sm line-clamp-2 flex-1">
                                      {issue.title}
                                    </h4>
                                    <Badge 
                                      variant="outline" 
                                      className={`text-xs ${priorityColors[issue.priority]}`}
                                    >
                                      {issue.priority}
                                    </Badge>
                                  </div>
                                  
                                  {issue.description && (
                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                      {issue.description}
                                    </p>
                                  )}
                                  
                                  {issue.assignee && (
                                    <div className="flex items-center gap-2">
                                      <Avatar className="h-6 w-6">
                                        <AvatarImage src={issue.assignee.imageUrl} />
                                        <AvatarFallback>
                                          {issue.assignee.firstName?.[0] || issue.assignee.email[0]?.toUpperCase() || "U"}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span className="text-xs text-muted-foreground">
                                        {issue.assignee.firstName} {issue.assignee.lastName}
                                        {!issue.assignee.firstName && issue.assignee.email}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Issue Detail Dialog */}
      {selectedIssue && (
        <IssueDialog
          issue={selectedIssue}
          open={!!selectedIssue}
          onOpenChange={(open) => !open && setSelectedIssue(null)}
          project={project}
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
}
