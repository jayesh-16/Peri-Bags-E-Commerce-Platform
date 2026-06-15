"use server";

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleBannerStatus(formData: FormData) {
  const id = formData.get("id") as string;
  const currentStatus = formData.get("currentStatus") === "true";
  
  if (!id) return { error: "Banner ID is required" };

  try {
    await prisma.banner.update({
      where: { id },
      data: { isActive: !currentStatus }
    });
    
    revalidatePath("/admin/banners");
    return { success: true };
  } catch (error) {
    console.error("Error toggling banner:", error);
    return { error: "Failed to toggle banner status" };
  }
}

export async function deleteBanner(formData: FormData) {
  const id = formData.get("id") as string;
  
  if (!id) return { error: "Banner ID is required" };

  try {
    await prisma.banner.delete({
      where: { id }
    });
    
    revalidatePath("/admin/banners");
    return { success: true };
  } catch (error) {
    console.error("Error deleting banner:", error);
    return { error: "Failed to delete banner" };
  }
}


export async function createBanner(formData: FormData) {
  const title = formData.get("title") as string;
  const subtitle = formData.get("subtitle") as string;
  const linkUrl = formData.get("linkUrl") as string;
  const image = formData.get("image") as File;

  if (!title || !image || image.size === 0) {
    return { error: "Title and Image are required" };
  }

  try {
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const imageUrl = await new Promise<string>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "peribags/banners" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result!.secure_url);
        }
      );
      uploadStream.end(buffer);
    });

    await prisma.banner.create({
      data: {
        title,
        subtitle: subtitle || null,
        imageUrl,
        linkUrl: linkUrl || null,
        isActive: true,
      }
    });

    revalidatePath("/admin/banners");
    return { success: true };
  } catch (error) {
    console.error("Error creating banner:", error);
    return { error: "Failed to create banner" };
  }
}
