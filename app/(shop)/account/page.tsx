import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account | Peri Bags",
  description: "Manage your Peri Bags account and order history.",
};

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user?.id) return null;

  const latestOrder = await prisma.order.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: {
          product: {
            include: { images: true }
          }
        }
      }
    }
  });

  const totalOrders = await prisma.order.count({
    where: { userId: session.user.id }
  });

  // Example "Wishlist" / Saved for Later products
  // In a real scenario, this would be fetched from the DB Wishlist table
  const savedProducts = await prisma.product.findMany({
    take: 4,
    where: { isPublished: true },
    include: { images: true }
  });

  return (
    <div className="space-y-12">
          
          {/* Welcome Header */}
          <header className="space-y-2">
            <h1 className="font-display text-4xl text-primary">Welcome back, {session.user.name?.split(' ')[0] || 'Guest'}</h1>
            <p className="text-on-surface-variant font-body text-lg">Manage your artisanal collection and track your latest handcrafted pieces.</p>
          </header>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Recent Order Summary (Bento-style Card) */}
            <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm border border-border/50 hover:shadow-md transition-shadow duration-300">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="font-display text-2xl font-semibold text-primary">Latest Order</h3>
                  <p className="text-sm text-on-surface-variant mt-1">
                    {latestOrder ? `Placed on ${latestOrder.createdAt.toLocaleDateString()} • #${latestOrder.orderNumber}` : 'No orders yet'}
                  </p>
                </div>
                {latestOrder && (
                  <span className={`px-3 py-1 ${latestOrder.status === 'DELIVERED' ? 'bg-success/10 text-success' : 'bg-secondary/10 text-secondary'} text-xs font-semibold rounded-full flex items-center gap-1`}>
                    <span className={`w-1.5 h-1.5 ${latestOrder.status === 'DELIVERED' ? 'bg-success' : 'bg-secondary'} rounded-full`}></span>
                    {latestOrder.status}
                  </span>
                )}
              </div>

              {latestOrder && latestOrder.items.length > 0 ? (
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="w-32 h-32 flex-shrink-0 overflow-hidden rounded-lg bg-muted relative">
                    {latestOrder.items[0].product.images[0] ? (
                      <Image 
                        src={latestOrder.items[0].product.images[0].url} 
                        alt={latestOrder.items[0].product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted text-on-surface-variant">
                        <span className="material-symbols-outlined">image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-grow text-center sm:text-left">
                    <h4 className="font-display text-xl font-semibold text-primary mb-1">{latestOrder.items[0].product.name}</h4>
                    <p className="text-on-surface-variant text-sm mb-4">Quantity: {latestOrder.items[0].quantity} • Total: ₹{latestOrder.total.toLocaleString('en-IN')}</p>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                      <Link href="/products" className="bg-primary text-white text-sm font-medium tracking-wide uppercase px-6 py-3 rounded-full hover:bg-secondary transition-colors shadow-sm">
                        Shop Again
                      </Link>
                      <button className="border border-secondary text-secondary text-sm font-medium tracking-wide uppercase px-6 py-3 rounded-full hover:bg-muted transition-colors">
                        Order Details
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4">shopping_bag</span>
                  <p className="text-on-surface-variant mb-6">You haven't placed any orders yet.</p>
                  <Link href="/products" className="bg-primary text-white text-sm font-medium tracking-wide uppercase px-6 py-3 rounded-full hover:bg-secondary transition-colors">
                    Start Shopping
                  </Link>
                </div>
              )}
            </div>

            {/* Profile Quick Stats */}
            <div className="bg-primary text-white rounded-lg p-6 shadow-sm flex flex-col justify-between">
              <div>
                <span className="material-symbols-outlined text-secondary/80 mb-4 text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                <h3 className="font-display text-2xl font-semibold">Artisan Tier</h3>
                <p className="text-white/70 text-sm mt-2">You have {totalOrders} orders. {totalOrders < 10 ? `Only ${10 - totalOrders} away from Master Collector status.` : 'You are a Master Collector!'}</p>
              </div>
              <div className="mt-8 space-y-4">
                <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-secondary h-full rounded-full transition-all duration-1000" 
                    style={{ width: `${Math.min((totalOrders / 10) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs font-medium text-white/80">
                  <span>{totalOrders} Orders</span>
                  <span>10 Orders</span>
                </div>
              </div>
            </div>
          </div>

          {/* Favorite Products Section */}
          <section className="space-y-6 pt-8">
            <div className="flex justify-between items-end">
              <h3 className="font-display text-2xl font-semibold text-primary">Inspired For You</h3>
              <Link href="/products" className="text-secondary text-sm font-medium hover:underline underline-offset-4">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {savedProducts.map((product) => (
                <div key={product.id} className="group cursor-pointer">
                  <Link href={`/products/${product.slug}`}>
                    <div className="aspect-[4/5] bg-muted rounded-lg overflow-hidden mb-3 relative">
                      {product.images[0] && (
                        <Image 
                          src={product.images[0].url} 
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                      <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-primary hover:text-secondary transition-colors z-10">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                      </button>
                    </div>
                    <h4 className="font-body font-semibold text-primary line-clamp-1">{product.name}</h4>
                    <p className="text-secondary font-bold">₹{product.price.toLocaleString('en-IN')}</p>
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Actions / Support */}
          <div className="bg-surface-container-low rounded-lg p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-border mt-8">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center text-secondary flex-shrink-0">
                <span className="material-symbols-outlined">support_agent</span>
              </div>
              <div>
                <h4 className="font-display text-xl font-semibold text-primary">Need assistance?</h4>
                <p className="text-on-surface-variant text-sm mt-1">Our craftsmen are here to help with sizing, repairs, or custom orders.</p>
              </div>
            </div>
            <Link href="/contact" className="whitespace-nowrap border border-primary text-primary text-sm font-medium tracking-wide uppercase px-8 py-3 rounded-full hover:bg-primary hover:text-white transition-all duration-300">
              Contact Support
            </Link>
          </div>

    </div>
  );
}
