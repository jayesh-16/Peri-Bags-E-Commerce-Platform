"use server";

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleProductPublishStatus(productId: string, currentStatus: boolean) {
  if (!productId) return { error: "Product ID is required" };

  try {
    await prisma.product.update({
      where: { id: productId },
      data: { isPublished: !currentStatus }
    });
    
    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error toggling product status:", error);
    return { error: "Failed to toggle product status" };
  }
}

export async function deleteProduct(productId: string) {
  if (!productId) return { error: "Product ID is required" };

  try {
    await prisma.product.delete({
      where: { id: productId }
    });
    
    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { error: "Failed to delete product" };
  }
}

export async function updateProductStock(productId: string, newStock: number) {
  if (!productId || newStock < 0) return { error: "Invalid product or stock value" };

  try {
    await prisma.product.update({
      where: { id: productId },
      data: { stock: newStock }
    });
    
    revalidatePath("/admin/products");
    revalidatePath(`/products/${productId}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating product stock:", error);
    return { error: "Failed to update product stock" };
  }
}
export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const comparePriceRaw = formData.get("comparePrice") as string;
  const comparePrice = comparePriceRaw ? parseFloat(comparePriceRaw) : null;
  const sku = formData.get("sku") as string;
  const stock = parseInt(formData.get("stock") as string, 10);
  const categoryId = formData.get("categoryId") as string;
  const isPublished = formData.get("isPublished") === "true";
  const isFeatured = formData.get("isFeatured") === "true";
  const image = formData.get("image") as File;

  if (!name || !description || isNaN(price) || isNaN(stock) || !categoryId || !image || image.size === 0) {
    return { error: "Please fill out all required fields and upload an image." };
  }

  try {
    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    // Process Image
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const imageUrl = await new Promise<string>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "peribags/products" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result!.secure_url);
        }
      );
      uploadStream.end(buffer);
    });

    // Database Transaction
    await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          name,
          slug,
          description,
          price,
          comparePrice,
          sku: sku || null,
          stock,
          categoryId,
          isPublished,
          isFeatured,
        }
      });

      await tx.productImage.create({
        data: {
          url: imageUrl,
          altText: name,
          productId: product.id,
          sortOrder: 0
        }
      });
    });

    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Error creating product:", error);
    if (error.code === 'P2002' && error.meta?.target?.includes('slug')) {
       return { error: "A product with this name/slug already exists." };
    }
    return { error: "Failed to create product" };
  }
}

export async function bulkDeleteProducts(productIds: string[]) {
  if (!productIds || productIds.length === 0) return { error: "No products selected" };

  try {
    await prisma.product.deleteMany({
      where: { id: { in: productIds } }
    });
    
    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error bulk deleting products:", error);
    return { error: "Failed to delete selected products" };
  }
}

export async function bulkUpdatePublishStatus(productIds: string[], isPublished: boolean) {
  if (!productIds || productIds.length === 0) return { error: "No products selected" };

  try {
    await prisma.product.updateMany({
      where: { id: { in: productIds } },
      data: { isPublished }
    });
    
    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error bulk updating publish status:", error);
    return { error: "Failed to update publish status for selected products" };
  }
}
