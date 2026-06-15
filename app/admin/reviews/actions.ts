"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function approveReview(formData: FormData) {
  const id = formData.get("id") as string;
  
  if (!id) return { error: "Review ID is required" };

  try {
    await prisma.review.update({
      where: { id },
      data: { isApproved: true }
    });
    
    revalidatePath("/admin/reviews");
    return { success: true };
  } catch (error) {
    console.error("Error approving review:", error);
    return { error: "Failed to approve review" };
  }
}

export async function deleteReview(formData: FormData) {
  const id = formData.get("id") as string;
  
  if (!id) return { error: "Review ID is required" };

  try {
    await prisma.review.delete({
      where: { id }
    });
    
    revalidatePath("/admin/reviews");
    return { success: true };
  } catch (error) {
    console.error("Error deleting review:", error);
    return { error: "Failed to delete review" };
  }
}
