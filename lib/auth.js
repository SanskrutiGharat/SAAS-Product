import { currentUser, auth } from "@clerk/nextjs";
import { db } from "./db";

export async function getCurrentUser() {
  const user = await currentUser();
  
  if (!user) {
    return null;
  }

  // Get or create user in our database
  let dbUser = await db.user.findUnique({
    where: { clerkId: user.id },
  });

  if (!dbUser) {
    dbUser = await db.user.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0]?.emailAddress || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        imageUrl: user.imageUrl || "",
      },
    });
  }

  return dbUser;
}

export async function getCurrentOrganization() {
  const { userId, orgId } = await auth();
  
  if (!userId || !orgId) {
    return null;
  }

  const membership = await db.organizationMember.findFirst({
    where: {
      userId: (await getCurrentUser())?.id,
      organizationId: orgId,
    },
    include: {
      organization: true,
    },
  });

  return membership?.organization || null;
}

export async function getCurrentUserRole() {
  const { userId, orgId } = await auth();
  
  if (!userId || !orgId) {
    return null;
  }

  const membership = await db.organizationMember.findFirst({
    where: {
      userId: (await getCurrentUser())?.id,
      organizationId: orgId,
    },
  });

  return membership?.role || null;
}
