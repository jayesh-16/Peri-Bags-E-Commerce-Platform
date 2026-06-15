import Image from "next/image";
import { prisma } from "@/lib/prisma";
import OrderStatusDropdown from "@/components/admin/OrderStatusDropdown";
import OrdersToolbar from "@/components/admin/OrdersToolbar";

export default async function AdminOrdersPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const statusParam = typeof searchParams.status === 'string' ? searchParams.status : undefined;
  const amountParam = typeof searchParams.amount === 'string' ? searchParams.amount : undefined;
  const startDateParam = typeof searchParams.startDate === 'string' ? searchParams.startDate : undefined;
  const endDateParam = typeof searchParams.endDate === 'string' ? searchParams.endDate : undefined;

  const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  const where: any = {};
  if (statusParam && validStatuses.includes(statusParam)) {
    where.status = statusParam;
  }
  
  if (amountParam) {
    if (amountParam === '0-500') where.total = { gte: 0, lte: 500 };
    else if (amountParam === '500-1500') where.total = { gt: 500, lte: 1500 };
    else if (amountParam === '1500+') where.total = { gt: 1500 };
  }

  if (startDateParam || endDateParam) {
    where.createdAt = {};
    if (startDateParam) {
      where.createdAt.gte = new Date(startDateParam);
    }
    if (endDateParam) {
      const end = new Date(endDateParam);
      end.setHours(23, 59, 59, 999); // Include the whole day
      where.createdAt.lte = end;
    }
  }

  const orders = await prisma.order.findMany({
    where,
    include: {
      user: true,
      shippingAddress: true,
      items: {
        include: {
          product: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const totalOrders = orders.length;
  
  // Date calculations
  const now = new Date();
  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  // Current Month Data
  const currentMonthOrders = orders.filter(o => o.createdAt >= startOfCurrentMonth);
  const revenueMtd = currentMonthOrders.reduce((sum, order) => sum + order.total, 0);

  // Previous Month Data
  const previousMonthOrders = orders.filter(o => o.createdAt >= startOfPreviousMonth && o.createdAt <= endOfPreviousMonth);
  const previousRevenueMtd = previousMonthOrders.reduce((sum, order) => sum + order.total, 0);

  // Growth Calculations
  const ordersGrowth = previousMonthOrders.length === 0 
    ? (currentMonthOrders.length > 0 ? 100 : 0) 
    : Math.round(((currentMonthOrders.length - previousMonthOrders.length) / previousMonthOrders.length) * 100);

  const revenueGrowth = previousRevenueMtd === 0 
    ? (revenueMtd > 0 ? 100 : 0) 
    : (((revenueMtd - previousRevenueMtd) / previousRevenueMtd) * 100).toFixed(1);

  // Average Processing Time (for non-pending orders)
  const processedOrders = orders.filter(o => o.status !== "PENDING");
  let avgProcessingDays = 0;
  if (processedOrders.length > 0) {
    const totalProcessingTimeMs = processedOrders.reduce((sum, order) => {
      return sum + (order.updatedAt.getTime() - order.createdAt.getTime());
    }, 0);
    avgProcessingDays = (totalProcessingTimeMs / processedOrders.length) / (1000 * 60 * 60 * 24);
  }

  // Bestseller Calculation
  const itemCounts: Record<string, { name: string, quantity: number }> = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      if (!itemCounts[item.productId]) {
        itemCounts[item.productId] = { name: item.product.name, quantity: 0 };
      }
      itemCounts[item.productId].quantity += item.quantity;
    });
  });

  let bestsellerName = "N/A";
  let maxQty = 0;
  Object.values(itemCounts).forEach(item => {
    if (item.quantity > maxQty) {
      maxQty = item.quantity;
      bestsellerName = item.name;
    }
  });

  return (
    <>
      <OrdersToolbar orders={orders} />

      {/* Orders Table Container */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-border">
                <th className="px-6 py-4 font-semibold text-caption uppercase tracking-wider text-muted-foreground">
                  <div className="flex items-center gap-2">
                    Order ID
                    <span className="material-symbols-outlined text-[16px] cursor-pointer" data-icon="unfold_more">unfold_more</span>
                  </div>
                </th>
                <th className="px-6 py-4 font-semibold text-caption uppercase tracking-wider text-muted-foreground">Date</th>
                <th className="px-6 py-4 font-semibold text-caption uppercase tracking-wider text-muted-foreground">Customer</th>
                <th className="px-6 py-4 font-semibold text-caption uppercase tracking-wider text-muted-foreground text-right">Total Amount</th>
                <th className="px-6 py-4 font-semibold text-caption uppercase tracking-wider text-muted-foreground">Status Pipeline</th>
                <th className="px-6 py-4 font-semibold text-caption uppercase tracking-wider text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((order) => {
                const name = order.user?.name || order.shippingAddress?.fullName || "Guest User";
                const email = order.user?.email || order.email || "guest@example.com";
                const avatarInitials = name.substring(0, 2).toUpperCase();
                const avatarColor = "bg-secondary-fixed text-on-secondary-fixed";
                return (
                  <tr key={order.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-body-md font-bold text-primary">{order.orderNumber}</span>
                    </td>
                    <td className="px-6 py-4 text-body-md text-on-surface-variant">
                      {order.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {order.user?.image ? (
                          <div className="relative w-8 h-8 rounded-full overflow-hidden">
                            <Image alt="Customer" src={order.user.image} fill className="object-cover" />
                          </div>
                        ) : (
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-caption font-bold ${avatarColor}`}>
                            {avatarInitials}
                          </div>
                        )}
                        <div>
                          <p className="text-body-md font-semibold text-primary">{name}</p>
                          <p className="text-caption text-muted-foreground">{email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-label-price text-label-price text-primary">₹{order.total.toLocaleString("en-IN")}</td>
                    <td className="px-6 py-4">
                      <OrderStatusDropdown orderId={order.id} initialStatus={order.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-muted-foreground hover:text-primary transition-colors">
                        <span className="material-symbols-outlined" data-icon="more_vert">more_vert</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 bg-surface-container-low border-t border-border flex items-center justify-between">
          <p className="text-caption text-muted-foreground">Showing 1 to {orders.length} of {totalOrders} orders</p>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-lg flex items-center justify-center border border-border text-muted-foreground hover:bg-surface-container transition-colors disabled:opacity-50" disabled>
              <span className="material-symbols-outlined text-[20px]" data-icon="chevron_left">chevron_left</span>
            </button>
            <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary text-on-primary font-semibold text-caption">1</button>
            <button className="w-8 h-8 rounded-lg flex items-center justify-center border border-border text-muted-foreground hover:bg-surface-container transition-colors disabled:opacity-50" disabled>
              <span className="material-symbols-outlined text-[20px]" data-icon="chevron_right">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Analytics Quick View (Bento Style) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-border shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-secondary-container/20 rounded-lg">
              <span className="material-symbols-outlined text-on-secondary-container" data-icon="receipt_long">receipt_long</span>
            </div>
            <span className={`text-caption font-bold flex items-center gap-0.5 ${ordersGrowth >= 0 ? 'text-success' : 'text-destructive'}`}>
              <span className="material-symbols-outlined text-[14px]" data-icon={ordersGrowth >= 0 ? 'trending_up' : 'trending_down'}>
                {ordersGrowth >= 0 ? 'trending_up' : 'trending_down'}
              </span>
              {ordersGrowth > 0 ? '+' : ''}{ordersGrowth}%
            </span>
          </div>
          <p className="text-muted-foreground text-caption font-semibold">Total Orders</p>
          <h4 className="text-headline-h2 font-headline-h2 text-primary mt-1">{totalOrders}</h4>
        </div>
        
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-border shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-success/10 rounded-lg">
              <span className="material-symbols-outlined text-success" data-icon="monetization_on">monetization_on</span>
            </div>
            <span className={`text-caption font-bold flex items-center gap-0.5 ${Number(revenueGrowth) >= 0 ? 'text-success' : 'text-destructive'}`}>
              <span className="material-symbols-outlined text-[14px]" data-icon={Number(revenueGrowth) >= 0 ? 'trending_up' : 'trending_down'}>
                {Number(revenueGrowth) >= 0 ? 'trending_up' : 'trending_down'}
              </span>
              {Number(revenueGrowth) > 0 ? '+' : ''}{revenueGrowth}%
            </span>
          </div>
          <p className="text-muted-foreground text-caption font-semibold">Revenue (MTD)</p>
          <h4 className="text-headline-h2 font-headline-h2 text-primary mt-1">₹{(revenueMtd / 1000).toFixed(1)}k</h4>
        </div>
        
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-border shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-error-container/40 rounded-lg">
              <span className="material-symbols-outlined text-on-error-container" data-icon="pending_actions">pending_actions</span>
            </div>
            {processedOrders.length > 0 && (
              <span className="text-success text-caption font-bold flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[14px]" data-icon="bolt">bolt</span>
                Fast
              </span>
            )}
          </div>
          <p className="text-muted-foreground text-caption font-semibold">Avg. Processing</p>
          <h4 className="text-headline-h2 font-headline-h2 text-primary mt-1">
            {processedOrders.length > 0 ? `${avgProcessingDays.toFixed(1)} days` : 'N/A'}
          </h4>
        </div>
        
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-border shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-tertiary-fixed/40 rounded-lg">
              <span className="material-symbols-outlined text-on-tertiary-fixed" data-icon="shopping_bag">shopping_bag</span>
            </div>
          </div>
          <p className="text-muted-foreground text-caption font-semibold">Bestseller</p>
          <h4 className="text-headline-h3 font-headline-h3 text-primary mt-1 truncate" title={bestsellerName}>{bestsellerName}</h4>
        </div>
      </div>
    </>
  );
}
