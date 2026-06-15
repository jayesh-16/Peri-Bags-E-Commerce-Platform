import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Star, Heart, Truck, ShieldCheck, ChevronRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { AddToCartButton } from '@/components/products/AddToCartButton';
import { WishlistButton } from '@/components/products/WishlistButton';
import { WishlistToggleIcon } from '@/components/products/WishlistToggleIcon';
import { auth } from '@/auth';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({ where: { slug: params.slug } });
  if (!product) return { title: 'Product Not Found | Peri Bags' };
  
  return {
    title: `${product.name} | Peri Bags`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      category: true,
      reviews: { 
        where: { isApproved: true },
        include: { user: true },
        orderBy: { createdAt: 'desc' }
      },
    },
  });

  if (!product) {
    notFound();
  }

  const session = await auth();
  
  let initialInWishlist = false;
  if (session?.user?.id) {
    const wishlistItem = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: product.id
        }
      }
    });
    initialInWishlist = !!wishlistItem;
  }

  const relatedProducts = await prisma.product.findMany({
    where: { categoryId: product.categoryId, NOT: { id: product.id }, isPublished: true },
    take: 4,
    include: { images: true },
  });

  let wishlistProductIds: string[] = [];
  if (session?.user?.id) {
    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId: session.user.id },
      select: { productId: true }
    });
    wishlistProductIds = wishlistItems.map(item => item.productId);
  }

  const attributes = JSON.parse(product.attributes || '{}');
  const discount = product.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) 
    : 0;

  const averageRating = product.reviews.length > 0 
    ? (product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length).toFixed(1)
    : 0;

  return (
    <main className="max-w-7xl mx-auto px-6 py-section-block">
      {/* Breadcrumbs */}
      <div className="mb-8 flex items-center space-x-2 text-on-surface-variant font-caption text-caption">
        <Link href="/" className="hover:text-secondary transition-colors">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={`/products?category=${product.category.slug}`} className="hover:text-secondary transition-colors">
          {product.category.name}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-primary">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-20">
        {/* Product Gallery (Left) */}
        <div className="space-y-6">
          {/* Main Image */}
          <div className="aspect-square bg-surface-container-low rounded-xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.04)] group relative">
            {product.images[0] && (
              <Image 
                src={product.images[0].url} 
                alt={product.name} 
                fill 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                priority
                unoptimized
              />
            )}
          </div>
          {/* Thumbnails Grid */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, idx) => (
                <button aria-label="View image thumbnail" key={img.id} className={`relative aspect-square bg-surface-container-low rounded-lg overflow-hidden border-2 ${idx === 0 ? 'border-primary' : 'border-transparent'} hover:border-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2`}>
                  <Image src={img.url} alt={`${product.name} - ${idx}`} fill className="object-cover" unoptimized />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info (Right) */}
        <div className="flex flex-col">
          {/* Category Label */}
          <span className="font-label-button text-label-button text-secondary uppercase tracking-widest mb-4">
            {product.category.name}
          </span>
          
          <h1 className="font-display-hero-mobile md:font-headline-h1 text-display-hero-mobile md:text-headline-h1 text-primary mb-4">
            {product.name}
          </h1>
          
          {/* Price & Reviews Row */}
          <div className="flex flex-wrap items-end gap-4 mb-8 pb-8 border-b border-border">
            <div className="flex items-end gap-3">
              <span className="font-headline-h2 text-headline-h2 text-primary">₹{product.price.toLocaleString('en-IN')}</span>
              {product.comparePrice && (
                <>
                  <span className="font-label-price text-label-price text-on-surface-variant line-through mb-1">
                    ₹{product.comparePrice.toLocaleString('en-IN')}
                  </span>
                  {discount > 0 && (
                    <span className="text-[12px] font-semibold text-success bg-success/10 px-2 py-1 rounded-sm mb-1">
                      Save {discount}%
                    </span>
                  )}
                </>
              )}
            </div>
            <div className="ml-auto flex items-center space-x-2">
              <div className="flex text-secondary">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-5 w-5 ${i < Math.round(Number(averageRating)) ? 'fill-current' : 'text-outline-variant stroke-current'}`} 
                    strokeWidth={i < Math.round(Number(averageRating)) ? 0 : 1.5}
                  />
                ))}
              </div>
              <span className="font-body-md text-body-md text-on-surface-variant">
                {product.reviews.length > 0 ? `(${averageRating} / 5 from ${product.reviews.length} reviews)` : '(No reviews yet)'}
              </span>
            </div>
          </div>

          <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed mb-10">
            {product.description}
          </p>

          {/* Value Props */}
          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="flex items-center space-x-3 p-4 bg-surface-container-lowest rounded-lg border border-border">
              <Truck className="h-6 w-6 text-secondary" strokeWidth={1.5} />
              <span className="font-body-md text-body-md text-primary font-medium">Free Shipping</span>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-surface-container-lowest rounded-lg border border-border">
              <ShieldCheck className="h-6 w-6 text-secondary" strokeWidth={1.5} />
              <span className="font-body-md text-body-md text-primary font-medium">1 Year Warranty</span>
            </div>
          </div>

          {/* Action Area */}
          <div className="mt-auto space-y-4">
            <div className="flex space-x-4">
              <div className="flex-grow">
                <AddToCartButton product={product} disabled={product.stock <= 0} />
              </div>
              <WishlistButton productId={product.id} initialInWishlist={initialInWishlist} />
            </div>
            <div className="text-center font-caption text-caption">
              {product.stock > 0 ? (
                <span className="text-success font-medium flex items-center justify-center">
                  <span className="mr-2 block w-2 h-2 rounded-full bg-success"></span>
                  In Stock (Ships within 24 hours)
                </span>
              ) : (
                <span className="text-error font-medium flex items-center justify-center">
                  <span className="mr-2 block w-2 h-2 rounded-full bg-error"></span>
                  Out of Stock
                </span>
              )}
            </div>
          </div>

          {/* Accordion / Details Placeholder */}
          {Object.keys(attributes).length > 0 && (
            <div className="mt-12 space-y-4">
              <div className="border border-border rounded-lg overflow-hidden bg-surface-container-lowest">
                <div className="w-full px-6 py-4 flex justify-between items-center text-primary font-body-lg text-body-lg font-medium">
                  <span>Product Details</span>
                </div>
                <div className="px-6 pb-4 text-on-surface-variant font-body-md text-body-md">
                  <ul className="space-y-3">
                    {Object.entries(attributes).map(([key, value]) => (
                      <li key={key} className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-border/50 last:border-0">
                        <span className="text-on-surface-variant capitalize">{key}</span>
                        <span className="font-medium text-primary">{value as React.ReactNode}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="pt-16 pb-8 border-t border-border mt-8">
        <h2 className="font-headline-h2 text-headline-h2 text-primary mb-8">Customer Reviews</h2>
        {product.reviews.length === 0 ? (
          <div className="bg-surface-container-lowest p-8 text-center rounded-lg border border-border">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2">rate_review</span>
            <p className="text-on-surface-variant font-body">No reviews yet. Be the first to review this product after purchasing!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {product.reviews.map((review) => (
              <div key={review.id} className="bg-surface-container-lowest p-6 rounded-lg border border-border">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary/10 text-secondary rounded-full flex items-center justify-center font-bold text-sm">
                      {review.user?.name ? review.user.name.substring(0, 1).toUpperCase() : 'A'}
                    </div>
                    <div>
                      <p className="font-semibold text-primary">{review.user?.name || 'Anonymous'}</p>
                      <p className="text-xs text-on-surface-variant">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex text-secondary">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'text-outline-variant stroke-current'}`} 
                        strokeWidth={i < review.rating ? 0 : 1.5}
                      />
                    ))}
                  </div>
                </div>
                {review.title && <h4 className="font-semibold text-primary mb-2">{review.title}</h4>}
                <p className="text-on-surface-variant font-body text-sm leading-relaxed whitespace-pre-wrap">{review.body}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="pt-20 border-t border-border">
          <h2 className="font-headline-h2 text-headline-h2 text-primary mb-12 text-center">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((p) => (
              <div key={p.id} className="group flex flex-col relative bg-muted rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-2">
                <div className="relative aspect-square overflow-hidden rounded-t-lg bg-surface-container-low block">
                  <Link href={`/products/${p.slug}`}>
                    {p.images[0] && (
                      <Image 
                        src={p.images[0].url} 
                        alt={p.name}
                        fill
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                        unoptimized
                      />
                    )}
                  </Link>
                  <WishlistToggleIcon 
                    productId={p.id} 
                    initialInWishlist={wishlistProductIds.includes(p.id)} 
                  />
                </div>
                <div className="p-card-padding flex flex-col flex-grow bg-surface-container-lowest rounded-b-lg border border-t-0 border-border">
                  <span className="font-caption text-caption text-on-surface-variant mb-1">Leather Goods</span>
                  <Link href={`/products/${p.slug}`}>
                    <h3 className="font-body-lg text-body-lg text-primary font-medium mb-2 line-clamp-1">{p.name}</h3>
                  </Link>
                  <div className="mt-auto flex justify-between items-center">
                    <span className="font-label-price text-label-price text-primary">₹{p.price.toLocaleString('en-IN')}</span>
                    <button aria-label="Add to cart" className="h-10 w-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center hover:bg-primary transition-colors group/btn">
                      <ShoppingBag className="h-5 w-5 transform group-hover/btn:-translate-y-1 transition-transform duration-300" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
