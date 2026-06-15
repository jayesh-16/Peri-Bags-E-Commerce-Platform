"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleWishlist(productId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "You must be logged in to add to wishlist." };
  }

  const userId = session.user.id;

  const existingItem = await prisma.wishlistItem.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  if (existingItem) {
    // Remove it
    await prisma.wishlistItem.delete({
      where: { id: existingItem.id },
    });
  } else {
    // Add it
    await prisma.wishlistItem.create({
      data: {
        userId,
        productId,
      },
    });
  }

  revalidatePath("/products/[slug]", "page");
  revalidatePath("/account/wishlist");
  
  return { success: true, added: !existingItem };
}
