"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function saveSettings(formData: FormData) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return { error: "Not authorized" };
  }

  // Define the keys we expect from the form
  const keysToSave = [
    "store_name",
    "support_email",
    "support_phone",
    "shipping_fee",
  ];

  try {
    for (const key of keysToSave) {
      const value = formData.get(key);
      if (value !== null) {
        await prisma.siteContent.upsert({
          where: { key },
          update: { value: value.toString() },
          create: { key, value: value.toString() },
        });
      }
    }

    revalidatePath("/admin/settings");
    revalidatePath("/contact"); // In case contact page uses these
    // Add other paths that might rely on global settings if needed
    
    return { success: true };
  } catch (error) {
    console.error("Error saving settings:", error);
    return { error: "Failed to save settings." };
  }
}
