"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function getAdminNotifications() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    const pendingOrders = await prisma.order.count({
      where: { status: "PENDING" },
    });

    const lowStockProducts = await prisma.product.count({
      where: { stock: { lt: 10 } },
    });

    return {
      pendingOrders,
      lowStockProducts,
      total: pendingOrders + lowStockProducts,
    };
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    return { error: "Failed to fetch notifications" };
  }
}
