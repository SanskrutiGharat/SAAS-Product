"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "./db";
import { getCurrentUser, getCurrentOrganization, getCurrentUserRole } from "./auth";

// Project Actions
export async function createProject(data) {
  const user = await getCurrentUser();
  const organization = await getCurrentOrganization();
  const userRole = await getCurrentUserRole();

  if (!user || !organization) {
    throw new Error("Unauthorized");
  }

  if (userRole !== "ADMIN") {
    throw new Error("Only admins can create projects");
  }

  // Check if project key already exists
  const existingProject = await db.project.findUnique({
    where: { key: data.key },
  });

  if (existingProject) {
    throw new Error("Project key already exists");
  }

  const project = await db.project.create({
    data: {
      name: data.name,
      key: data.key,
      description: data.description,
      organizationId: organization.id,
    },
  });

  revalidatePath("/dashboard");
  return project;
}

export async function getProject(projectId) {
  const user = await getCurrentUser();
  const organization = await getCurrentOrganization();

  if (!user || !organization) {
    throw new Error("Unauthorized");
  }

  const project = await db.project.findFirst({
    where: {
      id: projectId,
      organizationId: organization.id,
    },
    include: {
      sprints: {
        include: {
          issues: {
            include: {
              assignee: true,
            },
            orderBy: { order: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  return project;
}

// Sprint Actions
export async function createSprint(data) {
  const user = await getCurrentUser();
  const organization = await getCurrentOrganization();
  const userRole = await getCurrentUserRole();

  if (!user || !organization) {
    throw new Error("Unauthorized");
  }

  if (userRole !== "ADMIN") {
    throw new Error("Only admins can create sprints");
  }

  // Get project to check if it belongs to the organization
  const project = await db.project.findFirst({
    where: {
      id: data.projectId,
      organizationId: organization.id,
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  const sprint = await db.sprint.create({
    data: {
      name: data.name,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      projectId: data.projectId,
    },
  });

  revalidatePath(`/dashboard/projects/${data.projectId}`);
  return sprint;
}

export async function updateSprintStatus(sprintId, status) {
  const user = await getCurrentUser();
  const organization = await getCurrentOrganization();
  const userRole = await getCurrentUserRole();

  if (!user || !organization) {
    throw new Error("Unauthorized");
  }

  if (userRole !== "ADMIN") {
    throw new Error("Only admins can update sprint status");
  }

  const sprint = await db.sprint.findFirst({
    where: { id: sprintId },
    include: { project: true },
  });

  if (!sprint || sprint.project.organizationId !== organization.id) {
    throw new Error("Sprint not found");
  }

  const updatedSprint = await db.sprint.update({
    where: { id: sprintId },
    data: { status },
  });

  revalidatePath(`/dashboard/projects/${sprint.projectId}`);
  return updatedSprint;
}

// Issue Actions
export async function createIssue(data) {
  const user = await getCurrentUser();
  const organization = await getCurrentOrganization();

  if (!user || !organization) {
    throw new Error("Unauthorized");
  }

  // Get sprint to check if it belongs to the organization
  const sprint = await db.sprint.findFirst({
    where: { id: data.sprintId },
    include: { project: true },
  });

  if (!sprint || sprint.project.organizationId !== organization.id) {
    throw new Error("Sprint not found");
  }

  // Get the highest order number for issues in this sprint
  const lastIssue = await db.issue.findFirst({
    where: { sprintId: data.sprintId },
    orderBy: { order: "desc" },
  });

  const newOrder = (lastIssue?.order || 0) + 1;

  const issue = await db.issue.create({
    data: {
      title: data.title,
      description: data.description,
      priority: data.priority,
      status: data.status,
      order: newOrder,
      sprintId: data.sprintId,
      assigneeId: data.assigneeId || null,
    },
    include: {
      assignee: true,
    },
  });

  revalidatePath(`/dashboard/projects/${sprint.projectId}`);
  return issue;
}

export async function updateIssueStatus(issueId, status) {
  const user = await getCurrentUser();
  const organization = await getCurrentOrganization();

  if (!user || !organization) {
    throw new Error("Unauthorized");
  }

  const issue = await db.issue.findFirst({
    where: { id: issueId },
    include: {
      sprint: {
        include: { project: true },
      },
    },
  });

  if (!issue || issue.sprint.project.organizationId !== organization.id) {
    throw new Error("Issue not found");
  }

  const updatedIssue = await db.issue.update({
    where: { id: issueId },
    data: { status },
    include: {
      assignee: true,
    },
  });

  revalidatePath(`/dashboard/projects/${issue.sprint.projectId}`);
  return updatedIssue;
}

export async function updateIssueOrder(issueId, newStatus, newOrder) {
  const user = await getCurrentUser();
  const organization = await getCurrentOrganization();

  if (!user || !organization) {
    throw new Error("Unauthorized");
  }

  const issue = await db.issue.findFirst({
    where: { id: issueId },
    include: {
      sprint: {
        include: { project: true },
      },
    },
  });

  if (!issue || issue.sprint.project.organizationId !== organization.id) {
    throw new Error("Issue not found");
  }

  // Use a transaction to update the issue and reorder others
  const result = await db.$transaction(async (tx) => {
    // Update the moved issue
    const updatedIssue = await tx.issue.update({
      where: { id: issueId },
      data: {
        status: newStatus,
        order: newOrder,
      },
    });

    // Reorder other issues in the new status column
    await tx.issue.updateMany({
      where: {
        sprintId: issue.sprintId,
        status: newStatus,
        id: { not: issueId },
        order: { gte: newOrder },
      },
      data: {
        order: { increment: 1 },
      },
    });

    return updatedIssue;
  });

  revalidatePath(`/dashboard/projects/${issue.sprint.projectId}`);
  return result;
}

export async function updateIssue(issueId, data) {
  const user = await getCurrentUser();
  const organization = await getCurrentOrganization();

  if (!user || !organization) {
    throw new Error("Unauthorized");
  }

  const issue = await db.issue.findFirst({
    where: { id: issueId },
    include: {
      sprint: {
        include: { project: true },
      },
    },
  });

  if (!issue || issue.sprint.project.organizationId !== organization.id) {
    throw new Error("Issue not found");
  }

  const updatedIssue = await db.issue.update({
    where: { id: issueId },
    data: {
      title: data.title,
      description: data.description,
      priority: data.priority,
      assigneeId: data.assigneeId || null,
    },
    include: {
      assignee: true,
    },
  });

  revalidatePath(`/dashboard/projects/${issue.sprint.projectId}`);
  return updatedIssue;
}

// User Actions
export async function getOrganizationUsers() {
  const user = await getCurrentUser();
  const organization = await getCurrentOrganization();

  if (!user || !organization) {
    throw new Error("Unauthorized");
  }

  const users = await db.user.findMany({
    where: {
      memberships: {
        some: {
          organizationId: organization.id,
        },
      },
    },
    include: {
      memberships: {
        where: {
          organizationId: organization.id,
        },
      },
    },
  });

  return users;
}
