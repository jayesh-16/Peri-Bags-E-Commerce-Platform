"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteCategory(categoryId: string) {
  try {
    // Check if category has products
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: { _count: { select: { products: true } } }
    });

    if (!category) {
      return { error: "Category not found." };
    }

    if (category._count.products > 0) {
      return { error: `Cannot delete category. It has ${category._count.products} products associated with it. Please reassign or delete those products first.` };
    }

    await prisma.category.delete({
      where: { id: categoryId }
    });

    revalidatePath("/admin/categories");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { error: "Failed to delete category." };
  }
}

export async function createCategory(data: { name: string, slug: string, description?: string }) {
  try {
    await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
      }
    });
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error) {
    console.error("Error creating category:", error);
    return { error: "Failed to create category. Ensure the name and slug are unique." };
  }
}

export async function updateCategory(id: string, data: { name: string, slug: string, description?: string }) {
  try {
    await prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
      }
    });
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error) {
    console.error("Error updating category:", error);
    return { error: "Failed to update category. Ensure the name and slug are unique." };
  }
}
