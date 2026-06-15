"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitReview(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "You must be logged in to submit a review." };
  }

  const productId = formData.get("productId") as string;
  const ratingStr = formData.get("rating") as string;
  const title = formData.get("title") as string;
  const body = formData.get("body") as string;

  if (!productId || !ratingStr || !body) {
    return { success: false, error: "Missing required fields." };
  }

  const rating = parseInt(ratingStr, 10);
  if (isNaN(rating) || rating < 1 || rating > 5) {
    return { success: false, error: "Invalid rating." };
  }

  try {
    // Check if the user has actually purchased this product
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: { userId: session.user.id }
      }
    });

    if (!hasPurchased) {
      return { success: false, error: "You can only review products you have purchased." };
    }

    // Check if user has already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: session.user.id,
        productId,
      }
    });

    if (existingReview) {
      return { success: false, error: "You have already submitted a review for this product." };
    }

    await prisma.review.create({
      data: {
        userId: session.user.id,
        productId,
        rating,
        title: title || null,
        body,
        isApproved: false, // Must be approved by admin
        source: "SITE"
      }
    });

    revalidatePath("/account/history");
    revalidatePath(`/products`);
    
    return { success: true, message: "Review submitted successfully! It will appear once approved by our team." };
  } catch (error) {
    console.error("Failed to submit review:", error);
    return { success: false, error: "Failed to submit review. Please try again later." };
  }
}
