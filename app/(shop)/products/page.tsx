import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart } from 'lucide-react';
import ProductFilters from '@/components/products/ProductFilters';
import { auth } from '@/auth';
import { WishlistToggleIcon } from '@/components/products/WishlistToggleIcon';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const category = typeof searchParams.category === 'string' ? searchParams.category : undefined;
  const sort = typeof searchParams.sort === 'string' ? searchParams.sort : 'featured';
  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;

  let orderBy: Record<string, string> = {};
  if (sort === 'price_asc') orderBy = { price: 'asc' };
  else if (sort === 'price_desc') orderBy = { price: 'desc' };
  else if (sort === 'newest') orderBy = { createdAt: 'desc' };
  else orderBy = { isFeatured: 'desc' }; // 'featured'

  const products = await prisma.product.findMany({
    where: {
      isPublished: true,
      ...(category && { category: { slug: category } }),
      ...(search && { name: { contains: search } }),
    },
    orderBy,
    include: { images: true },
  });

  const categories = await prisma.category.findMany();

  const session = await auth();
  let wishlistProductIds: string[] = [];
  if (session?.user?.id) {
    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId: session.user.id },
      select: { productId: true }
    });
    wishlistProductIds = wishlistItems.map(item => item.productId);
  }

  return (
    <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-section-block">
      {/* Page Header */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between border-b border-border pb-6">
        <div>
          <h1 className="font-display-hero text-headline-h1 md:text-display-hero text-primary mb-4 tracking-tight">
            {search ? `Search Results for "${search}"` : category ? `${category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}` : 'Our Collection'}
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            {search 
              ? `Showing results matching "${search}" across our collections.`
              : 'Discover our curated selection of artisanal leather bags, designed for both elegance and everyday utility.'}
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex-shrink-0 font-body-md text-body-md">
          <ProductFilters categories={categories} currentCategory={category} currentSort={sort} />
        </aside>

        {/* Product Grid */}
        <div className="flex-grow">
          {/* Header row for mobile/search status */}
          <div className="flex justify-between items-center mb-6">
            <span className="font-body-md text-body-md text-on-surface-variant">
              Showing {products.length} results
            </span>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20 bg-surface-container-low rounded-lg border border-border">
              <h3 className="text-xl font-medium mb-2 text-primary">No products found</h3>
              <p className="text-on-surface-variant">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <div key={product.id} className="group flex flex-col relative bg-muted rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-2">
                  <div className="relative aspect-square overflow-hidden rounded-t-lg bg-surface-container-low block">
                    <Link href={`/products/${product.slug}`}>
                      {product.images[0] && (
                        <Image 
                          src={product.images[0].url} 
                          alt={product.name}
                          fill
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                          unoptimized
                        />
                      )}
                    </Link>
                    {product.isFeatured && (
                      <span className="absolute top-3 left-3 bg-success text-on-primary font-caption text-[11px] px-2 py-1 rounded-full uppercase tracking-wider font-semibold z-10 pointer-events-none">New</span>
                    )}
                    <WishlistToggleIcon 
                      productId={product.id} 
                      initialInWishlist={wishlistProductIds.includes(product.id)} 
                    />
                  </div>
                  <div className="p-card-padding flex flex-col flex-grow bg-surface-container-lowest rounded-b-lg border border-t-0 border-border">
                    <span className="font-caption text-caption text-on-surface-variant mb-1">Leather Goods</span>
                    <Link href={`/products/${product.slug}`}>
                      <h3 className="font-body-lg text-body-lg text-primary font-medium mb-2 line-clamp-1">{product.name}</h3>
                    </Link>
                    <div className="mt-auto flex justify-between items-center">
                      <span className="font-label-price text-label-price text-primary">₹{product.price.toLocaleString('en-IN')}</span>
                      <button aria-label="Add to cart" className="h-10 w-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center hover:bg-primary transition-colors group/btn">
                        <ShoppingCart className="h-5 w-5 transform group-hover/btn:-translate-y-1 transition-transform duration-300" strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
