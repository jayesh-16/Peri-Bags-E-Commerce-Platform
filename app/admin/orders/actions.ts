"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(orderId: string, status: string) {
  if (!orderId || !status) {
    return { error: "Order ID and Status are required" };
  }

  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: status.toUpperCase() }
    });
    
    revalidatePath("/admin/orders");
    revalidatePath("/admin"); // Revalidate dashboard stats if needed
    return { success: true };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { error: "Failed to update order status" };
  }
}
