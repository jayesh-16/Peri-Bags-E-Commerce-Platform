"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface OrderItemInput {
  productId: string;
  quantity: number;
  price: number;
}

interface ShippingDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
}

export async function placeOrder(shippingDetails: ShippingDetails, items: OrderItemInput[], totalAmount: number) {
  try {
    if (!items || items.length === 0) {
      return { error: "Your cart is empty." };
    }

    // 1. Verify stock for all items BEFORE transaction
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });

      if (!product) {
        return { 
          error: `An item in your cart is no longer available in our catalog. It has been removed from your cart.`, 
          missingProductId: item.productId 
        };
      }

      if (product.stock < item.quantity) {
        return { 
          error: `Sorry, "${product.name}" is out of stock. We only have ${product.stock} left.`,
          outOfStockProductId: item.productId
        };
      }
    }

    // Wrap everything in a Prisma transaction
    const result = await prisma.$transaction(async (tx) => {

      // 2. Decrement stock for all items
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });
      }

      // 3. Create Address
      const address = await tx.address.create({
        data: {
          fullName: shippingDetails.fullName,
          phone: shippingDetails.phone,
          line1: shippingDetails.address,
          city: shippingDetails.city,
          state: shippingDetails.state,
          postalCode: shippingDetails.pinCode,
          country: "India" // Default for now
        }
      });

      // 4. Create Order
      const orderNumber = `PB-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      
      const order = await tx.order.create({
        data: {
          orderNumber,
          status: "PENDING",
          subtotal: totalAmount,
          shippingCost: 0,
          total: totalAmount,
          email: shippingDetails.email,
          addressId: address.id,
          items: {
            create: items.map(item => ({
              quantity: item.quantity,
              unitPrice: item.price,
              total: item.price * item.quantity,
              productId: item.productId
            }))
          }
        }
      });

      return order;
    });

    // Revalidate paths so inventory and orders dashboards update
    revalidatePath("/admin/orders");
    revalidatePath("/admin/products");
    revalidatePath("/products");

    return { success: true, orderId: result.orderNumber };
  } catch (error: any) {
    console.error("Order placement error:", error);
    return { error: error.message || "An error occurred while placing your order." };
  }
}
