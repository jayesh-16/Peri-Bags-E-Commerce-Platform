"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addAddress(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "You must be logged in to add an address." };
  }

  const fullName = formData.get("fullName") as string;
  const phone = formData.get("phone") as string;
  const line1 = formData.get("line1") as string;
  const line2 = formData.get("line2") as string;
  const city = formData.get("city") as string;
  const state = formData.get("state") as string;
  const postalCode = formData.get("postalCode") as string;
  const country = (formData.get("country") as string) || "India";

  if (!fullName || !phone || !line1 || !city || !state || !postalCode) {
    return { error: "Please fill out all required fields." };
  }

  try {
    await prisma.address.create({
      data: {
        userId: session.user.id,
        fullName,
        phone,
        line1,
        line2,
        city,
        state,
        postalCode,
        country,
      },
    });

    revalidatePath("/account/addresses");
    return { success: true };
  } catch (error) {
    console.error("Error creating address:", error);
    return { error: "Failed to save address. Please try again." };
  }
}

export async function deleteAddress(addressId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  try {
    // Verify ownership before deleting
    const address = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address || address.userId !== session.user.id) {
      return { error: "Address not found or not authorized" };
    }

    await prisma.address.delete({
      where: { id: addressId },
    });

    revalidatePath("/account/addresses");
    return { success: true };
  } catch (error) {
    console.error("Error deleting address:", error);
    return { error: "Failed to delete address." };
  }
}
