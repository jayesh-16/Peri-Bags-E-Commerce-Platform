import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q || typeof q !== 'string') {
    return NextResponse.json({ products: [] });
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        isPublished: true,
        name: {
          contains: q
        }
      },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        images: {
          take: 1,
          select: {
            url: true,
            altText: true
          }
        }
      },
      take: 5,
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
