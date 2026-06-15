import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import CreateProductForm from "@/components/admin/CreateProductForm";
import ProductTableWrapper from "@/components/admin/ProductTableWrapper";
import ExportButton from "@/components/admin/ExportButton";
import SortDropdown from "@/components/admin/SortDropdown";

export default async function AdminProductsPage({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const categoryParam = typeof searchParams.category === 'string' ? searchParams.category : 'all';
  const pageParam = typeof searchParams.page === 'string' ? parseInt(searchParams.page, 10) : 1;
  const sortParam = typeof searchParams.sort === 'string' ? searchParams.sort : 'newest';
  
  const take = 10;
  const skip = (pageParam - 1) * take;

  const whereCondition: any = {};
  if (categoryParam && categoryParam !== 'all') {
    whereCondition.categoryId = categoryParam;
  }

  let orderByCondition: any = { createdAt: 'desc' };
  if (sortParam === 'price_asc') orderByCondition = { price: 'asc' };
  else if (sortParam === 'price_desc') orderByCondition = { price: 'desc' };
  else if (sortParam === 'stock_asc') orderByCondition = { stock: 'asc' };
  else if (sortParam === 'stock_desc') orderByCondition = { stock: 'desc' };

  // Fetch data
  const [categories, products, totalCount, totalBags, publishedBags, lowStockCount] = await Promise.all([
    prisma.category.findMany({ select: { id: true, name: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.product.findMany({
      where: whereCondition,
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' }, take: 1 }
      },
      orderBy: orderByCondition,
      skip,
      take
    }),
    prisma.product.count({ where: whereCondition }),
    prisma.product.count(),
    prisma.product.count({ where: { isPublished: true } }),
    prisma.product.count({ where: { stock: { lt: 10 } } })
  ]);

  const drafts = totalBags - publishedBags;
  const totalPages = Math.ceil(totalCount / take) || 1;

  // Helper to construct URLs
  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams();
    if (categoryParam !== 'all') params.set('category', categoryParam);
    if (pageParam !== 1) params.set('page', pageParam.toString());
    if (sortParam !== 'newest') params.set('sort', sortParam);
    params.set(name, value);
    if (name === 'category') params.delete('page'); // reset page on category change
    return `?${params.toString()}`;
  };

  return (
    <>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-4 gap-4">
        <div>
          <h2 className="font-headline-h1 text-headline-h1 text-primary">Product Collection</h2>
          <p className="text-body-md text-muted-foreground mt-1">Manage your artisanal bag inventory and publishing status.</p>
        </div>
      </div>

      <CreateProductForm categories={categories} />

      {/* Filters & Stats Bento */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-surface-container-lowest p-card-padding rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
            <span className="material-symbols-outlined">inventory_2</span>
          </div>
          <div>
            <p className="text-caption text-muted-foreground">Total Bags</p>
            <p className="text-headline-h3 font-headline-h3">{totalBags}</p>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-card-padding rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center text-success">
            <span className="material-symbols-outlined">check_circle</span>
          </div>
          <div>
            <p className="text-caption text-muted-foreground">Published</p>
            <p className="text-headline-h3 font-headline-h3">{publishedBags}</p>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-card-padding rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-secondary-container/20 flex items-center justify-center text-on-secondary-container">
            <span className="material-symbols-outlined">edit_document</span>
          </div>
          <div>
            <p className="text-caption text-muted-foreground">Drafts</p>
            <p className="text-headline-h3 font-headline-h3">{drafts}</p>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-card-padding rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-error-container/20 flex items-center justify-center text-error">
            <span className="material-symbols-outlined">warning</span>
          </div>
          <div>
            <p className="text-caption text-muted-foreground">Low Stock</p>
            <p className="text-headline-h3 font-headline-h3">{lowStockCount}</p>
          </div>
        </div>
      </div>

      {/* Product Table Area */}
      <div className="bg-surface-container-lowest rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <Link 
              href="?category=all" 
              className={`px-4 py-2 rounded-lg text-body-md transition-colors ${categoryParam === 'all' ? 'bg-surface-container-high font-semibold text-primary' : 'hover:bg-surface-container font-medium text-muted-foreground'}`}
            >
              All Products
            </Link>
            {categories.map(cat => (
              <Link 
                key={cat.id} 
                href={`?category=${cat.id}`}
                className={`px-4 py-2 rounded-lg text-body-md transition-colors ${categoryParam === cat.id ? 'bg-surface-container-high font-semibold text-primary' : 'hover:bg-surface-container font-medium text-muted-foreground'}`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <SortDropdown />
            <ExportButton products={products} />
          </div>
        </div>

        <ProductTableWrapper products={products} />

        {/* Pagination */}
        <div className="p-6 bg-surface-container-low/30 border-t border-border flex items-center justify-between">
          <p className="text-caption text-muted-foreground">
            Showing {Math.min((pageParam - 1) * take + 1, totalCount)} to {Math.min(pageParam * take, totalCount)} of {totalCount} products
          </p>
          <div className="flex gap-2">
            <Link 
              href={pageParam > 1 ? createQueryString('page', (pageParam - 1).toString()) : '#'}
              className={`px-4 py-2 border border-border rounded-lg text-body-md transition-colors ${pageParam > 1 ? 'hover:bg-surface-container text-primary' : 'opacity-50 cursor-not-allowed text-muted-foreground'}`}
              aria-disabled={pageParam <= 1}
            >
              Previous
            </Link>
            <div className="px-4 py-2 border border-border rounded-lg bg-primary-container text-on-primary font-semibold text-body-md">
              {pageParam}
            </div>
            <Link 
              href={pageParam < totalPages ? createQueryString('page', (pageParam + 1).toString()) : '#'}
              className={`px-4 py-2 border border-border rounded-lg text-body-md transition-colors ${pageParam < totalPages ? 'hover:bg-surface-container text-primary' : 'opacity-50 cursor-not-allowed text-muted-foreground'}`}
              aria-disabled={pageParam >= totalPages}
            >
              Next
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
