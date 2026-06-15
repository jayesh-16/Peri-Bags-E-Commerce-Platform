import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { ReviewFormModal } from "@/components/products/ReviewFormModal";

export const metadata: Metadata = {
  title: "Order History | Peri Bags",
};

export default async function OrderHistoryPage() {
  const session = await auth();

  if (!session?.user?.id) return null;

  const orders = await prisma.order.findMany({
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

  const userReviews = await prisma.review.findMany({
    where: { userId: session.user.id },
    select: { productId: true }
  });
  const reviewedProductIds = userReviews.map(r => r.productId);

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="font-display text-4xl text-primary">Order History</h1>
        <p className="text-on-surface-variant font-body text-lg">View and track all your previous purchases.</p>
      </header>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center shadow-sm border border-border flex flex-col items-center">
          <span className="material-symbols-outlined text-6xl text-border mb-4">inventory_2</span>
          <h3 className="font-display text-2xl font-semibold text-primary mb-2">No orders yet</h3>
          <p className="text-on-surface-variant mb-6">When you buy something, it will appear here.</p>
          <Link href="/products" className="bg-primary text-white text-sm font-medium tracking-wide uppercase px-8 py-3 rounded-full hover:bg-secondary transition-colors">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg p-6 shadow-sm border border-border/50">
              <div className="flex flex-col md:flex-row justify-between md:items-center border-b border-border pb-4 mb-6 gap-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full text-sm">
                  <div>
                    <p className="text-on-surface-variant uppercase tracking-wider text-[11px] font-semibold mb-1">Order Placed</p>
                    <p className="font-medium text-primary">{order.createdAt.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-on-surface-variant uppercase tracking-wider text-[11px] font-semibold mb-1">Total</p>
                    <p className="font-medium text-primary">₹{order.total.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-on-surface-variant uppercase tracking-wider text-[11px] font-semibold mb-1">Order #</p>
                    <p className="font-medium text-primary">{order.orderNumber}</p>
                  </div>
                  <div className="md:text-right flex items-center md:justify-end">
                    <span className={`px-3 py-1 ${order.status === 'DELIVERED' ? 'bg-success/10 text-success' : 'bg-secondary/10 text-secondary'} text-xs font-semibold rounded-full inline-flex items-center gap-1`}>
                      <span className={`w-1.5 h-1.5 ${order.status === 'DELIVERED' ? 'bg-success' : 'bg-secondary'} rounded-full`}></span>
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-6 items-center">
                    <Link href={`/products/${item.product.slug}`} className="w-24 h-24 flex-shrink-0 bg-muted rounded-md overflow-hidden relative">
                      {item.product.images[0] ? (
                        <Image 
                          src={item.product.images[0].url} 
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted text-on-surface-variant">
                          <span className="material-symbols-outlined">image</span>
                        </div>
                      )}
                    </Link>
                    <div className="flex-grow">
                      <Link href={`/products/${item.product.slug}`} className="font-display text-xl font-semibold text-primary hover:text-secondary transition-colors">
                        {item.product.name}
                      </Link>
                      <p className="text-on-surface-variant text-sm mt-1">Quantity: {item.quantity} • ₹{item.unitPrice.toLocaleString('en-IN')} each</p>
                    </div>
                    <div className="hidden sm:block">
                      <ReviewFormModal 
                        productId={item.productId} 
                        productName={item.product.name} 
                        alreadyReviewed={reviewedProductIds.includes(item.productId)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
