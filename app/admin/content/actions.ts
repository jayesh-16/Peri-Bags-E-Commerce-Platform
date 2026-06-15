"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateContent(key: string, value: string) {
  try {
    await prisma.siteContent.upsert({
      where: { key },
      update: { value },
      create: { key, value }
    });

    revalidatePath("/admin/content");
    // Revalidate paths where this content might be used
    revalidatePath("/");
    revalidatePath("/about");
    
    return { success: true };
  } catch (error: any) {
    console.error("Error updating content:", error);
    return { error: "Failed to update content." };
  }
}
