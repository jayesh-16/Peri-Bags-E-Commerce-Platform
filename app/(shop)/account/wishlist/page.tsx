import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { revalidatePath } from "next/cache";

export const metadata: Metadata = {
  title: "Wishlist | Peri Bags",
};

export default async function WishlistPage() {
  const session = await auth();

  if (!session?.user?.id) return null;

  const wishlistItems = await prisma.wishlistItem.findMany({
    where: { userId: session.user.id },
    include: {
      product: {
        include: { images: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8">
      <header className="space-y-2 flex justify-between items-end border-b border-border pb-6">
        <div>
          <h1 className="font-display text-4xl text-primary">Wishlist</h1>
          <p className="text-on-surface-variant font-body text-lg mt-2">Saved pieces you're keeping an eye on.</p>
        </div>
        <div className="text-sm font-semibold text-on-surface-variant">
          {wishlistItems.length} {wishlistItems.length === 1 ? 'Item' : 'Items'}
        </div>
      </header>

      {wishlistItems.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center shadow-sm border border-border flex flex-col items-center">
          <span className="material-symbols-outlined text-6xl text-border mb-4">favorite</span>
          <h3 className="font-display text-2xl font-semibold text-primary mb-2">Your wishlist is empty</h3>
          <p className="text-on-surface-variant mb-6">Discover our artisan pieces and save your favorites here.</p>
          <Link href="/products" className="bg-primary text-white text-sm font-medium tracking-wide uppercase px-8 py-3 rounded-full hover:bg-secondary transition-colors">
            Explore Collection
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {wishlistItems.map((item) => (
            <div key={item.id} className="group relative">
              <Link href={`/products/${item.product.slug}`} className="block">
                <div className="aspect-[4/5] bg-muted rounded-lg overflow-hidden mb-4 relative">
                  {item.product.images[0] ? (
                    <Image 
                      src={item.product.images[0].url} 
                      alt={item.product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted text-on-surface-variant">
                      <span className="material-symbols-outlined">image</span>
                    </div>
                  )}
                  {/* Remove Button overlay */}
                  <form 
                    action={async () => {
                      "use server";
                      await prisma.wishlistItem.delete({ where: { id: item.id } });
                      revalidatePath("/account/wishlist");
                    }}
                    className="absolute top-3 right-3 z-10"
                  >
                    <button type="submit" className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-primary hover:text-destructive hover:scale-110 transition-all shadow-sm">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>close</span>
                    </button>
                  </form>
                </div>
                <div>
                  <h4 className="font-display text-xl font-semibold text-primary mb-1">{item.product.name}</h4>
                  <p className="text-secondary font-bold font-body text-lg">₹{item.product.price.toLocaleString('en-IN')}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
