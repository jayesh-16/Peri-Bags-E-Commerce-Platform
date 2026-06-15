import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Search Results | Admin",
};

export default async function AdminSearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q || "";

  // If no query, return an empty state
  if (!query) {
    return (
      <div className="space-y-8">
        <h1 className="font-display text-4xl text-primary">Search</h1>
        <p className="text-on-surface-variant font-body">Please enter a search term in the header to find orders or stock.</p>
      </div>
    );
  }

  // Fetch matching Products (by name or sku)
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: query } },
        { sku: { contains: query } },
      ],
    },
    include: {
      images: { take: 1 },
      category: true,
    },
    take: 10,
  });

  // Fetch matching Orders (by orderNumber or email)
  const orders = await prisma.order.findMany({
    where: {
      OR: [
        { orderNumber: { contains: query } },
        { email: { contains: query } },
      ],
    },
    include: {
      user: true,
    },
    take: 10,
  });

  return (
    <div className="space-y-12">
      <div className="mb-8">
        <h1 className="font-display text-4xl text-primary">
          Search Results for "{query}"
        </h1>
        <p className="text-on-surface-variant mt-2 font-body-md">
          Found {products.length} product(s) and {orders.length} order(s).
        </p>
      </div>

      {/* Products Section */}
      <div>
        <h2 className="font-display text-2xl text-primary mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary text-[24px]">shopping_bag</span>
          Products
        </h2>
        
        {products.length === 0 ? (
          <p className="text-on-surface-variant italic font-body">No products matched your search.</p>
        ) : (
          <div className="bg-surface-container-lowest border border-border rounded-lg shadow-sm overflow-hidden">
            <table className="w-full text-left font-body">
              <thead className="bg-surface-container-low text-on-surface-variant text-sm border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-medium">Product</th>
                  <th className="px-6 py-4 font-medium">SKU</th>
                  <th className="px-6 py-4 font-medium">Price</th>
                  <th className="px-6 py-4 font-medium">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/admin/products`} className="flex items-center gap-4 group">
                        <div className="w-12 h-12 relative rounded-md overflow-hidden bg-muted">
                          {product.images[0]?.url ? (
                            <Image src={product.images[0].url} alt={product.name} fill className="object-cover" />
                          ) : (
                            <span className="material-symbols-outlined absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-muted-foreground">image</span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-primary group-hover:text-secondary transition-colors">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.category?.name}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant">{product.sku || "N/A"}</td>
                    <td className="px-6 py-4 text-on-surface-variant">₹{product.price.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${product.stock > 10 ? 'bg-success/10 text-success' : product.stock > 0 ? 'bg-secondary/10 text-secondary' : 'bg-destructive/10 text-destructive'}`}>
                        {product.stock} in stock
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Orders Section */}
      <div>
        <h2 className="font-display text-2xl text-primary mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary text-[24px]">shopping_cart</span>
          Orders
        </h2>
        
        {orders.length === 0 ? (
          <p className="text-on-surface-variant italic font-body">No orders matched your search.</p>
        ) : (
          <div className="bg-surface-container-lowest border border-border rounded-lg shadow-sm overflow-hidden">
            <table className="w-full text-left font-body">
              <thead className="bg-surface-container-low text-on-surface-variant text-sm border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-medium">Order Number</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Total</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/admin/orders`} className="font-medium text-primary hover:text-secondary transition-colors">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-primary">{order.user?.name || "Guest"}</p>
                      <p className="text-xs text-muted-foreground">{order.email || order.user?.email}</p>
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant">₹{order.total.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${
                        order.status === "DELIVERED" ? 'bg-success/10 text-success' :
                        order.status === "SHIPPED" ? 'bg-secondary/10 text-secondary' :
                        order.status === "CANCELLED" ? 'bg-destructive/10 text-destructive' :
                        'bg-primary/10 text-primary'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
