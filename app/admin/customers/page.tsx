import Image from "next/image";
import { prisma } from "@/lib/prisma";
import ExportCustomersButton from "@/components/admin/ExportCustomersButton";

// Helper to assign a plausible gender-based avatar
function getPlaceholderAvatar(name: string | null): string {
  if (!name || name === "Guest User" || name === "Unknown") return "/images/placeholder_female.png";
  
  const firstName = name.split(" ")[0].toLowerCase().replace(/[^a-z]/g, "");
  
  // Common female name endings
  if (firstName.endsWith("a") || firstName.endsWith("i") || firstName.endsWith("ee") || firstName.endsWith("ya")) {
    return "/images/placeholder_female.png";
  }
  
  // Common male name endings (especially Indian names)
  if (firstName.endsWith("sh") || firstName.endsWith("an") || firstName.endsWith("am") || firstName.endsWith("ar") || firstName.endsWith("deep") || firstName.endsWith("jit") || firstName.endsWith("vir") || firstName.endsWith("raj") || firstName.endsWith("nav")) {
     return "/images/placeholder_male.png";
  }

  // Deterministic fallback based on name length/chars
  let hash = 0;
  for (let i = 0; i < firstName.length; i++) {
    hash = firstName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 2 === 0 ? "/images/placeholder_male.png" : "/images/placeholder_female.png";
}

export default async function AdminCustomersPage() {
  // 1. Fetch Registered Customers
  const registeredUsers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    include: {
      orders: {
        where: { status: { not: "CANCELLED" } }
      }
    }
  });

  // 2. Fetch Guest Orders
  const guestOrders = await prisma.order.findMany({
    where: { userId: null, email: { not: null }, status: { not: "CANCELLED" } },
    include: { shippingAddress: true }
  });

  // 3. Map Registered Users
  const customersMap = new Map<string, any>();

  registeredUsers.forEach(user => {
    const totalOrders = user.orders.length;
    const totalSpent = user.orders.reduce((sum, o) => sum + o.total, 0);
    const lastOrderDate = user.orders.length > 0 
      ? new Date(Math.max(...user.orders.map(o => o.createdAt.getTime())))
      : null;

    customersMap.set(user.email, {
      id: user.id,
      email: user.email,
      name: user.name || "Unknown",
      isGuest: false,
      totalOrders,
      totalSpent,
      lastOrderDate,
      joinedDate: user.createdAt,
      avatarUrl: user.image || getPlaceholderAvatar(user.name)
    });
  });

  // 4. Map Guest Users
  guestOrders.forEach(order => {
    if (!order.email) return;
    
    if (customersMap.has(order.email)) {
      // Rare case where an email is registered but made an order as guest before registration
      const existing = customersMap.get(order.email);
      existing.totalOrders += 1;
      existing.totalSpent += order.total;
      if (!existing.lastOrderDate || order.createdAt > existing.lastOrderDate) {
        existing.lastOrderDate = order.createdAt;
      }
    } else {
      customersMap.set(order.email, {
        id: `guest-${order.email}`,
        email: order.email,
        name: order.shippingAddress?.fullName || "Guest User",
        isGuest: true,
        totalOrders: 1,
        totalSpent: order.total,
        lastOrderDate: order.createdAt,
        joinedDate: order.createdAt, // First order date
        avatarUrl: getPlaceholderAvatar(order.shippingAddress?.fullName || null)
      });
    }
  });

  const allCustomers = Array.from(customersMap.values())
    .sort((a, b) => b.totalSpent - a.totalSpent); // Sort by highest spender

  const totalCustomersCount = allCustomers.length;
  const registeredCount = allCustomers.filter(c => !c.isGuest).length;
  const guestCount = allCustomers.filter(c => c.isGuest).length;
  const topSpender = allCustomers.length > 0 ? allCustomers[0] : null;

  return (
    <>
      {/* Page Header */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="font-headline-h1 text-headline-h1 text-primary">Customer Registry</h2>
          <p className="text-body-lg text-muted-foreground mt-1">Manage your boutique&apos;s registered members and guest shoppers.</p>
        </div>
        <ExportCustomersButton customers={allCustomers} />
      </div>

      {/* Analytics Bento */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-border shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-primary-container/40 rounded-lg">
              <span className="material-symbols-outlined text-on-primary-container" data-icon="group">group</span>
            </div>
          </div>
          <p className="text-muted-foreground text-caption font-semibold">Total Audience</p>
          <h4 className="text-headline-h2 font-headline-h2 text-primary mt-1">{totalCustomersCount}</h4>
          <p className="text-caption text-muted-foreground mt-2">Combined users and guests</p>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl border border-border shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-secondary-container/40 rounded-lg">
              <span className="material-symbols-outlined text-on-secondary-container" data-icon="how_to_reg">how_to_reg</span>
            </div>
          </div>
          <p className="text-muted-foreground text-caption font-semibold">Registered</p>
          <h4 className="text-headline-h2 font-headline-h2 text-primary mt-1">{registeredCount}</h4>
          <p className="text-caption text-muted-foreground mt-2">{totalCustomersCount > 0 ? Math.round((registeredCount / totalCustomersCount) * 100) : 0}% of total</p>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl border border-border shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-tertiary-fixed/40 rounded-lg">
              <span className="material-symbols-outlined text-on-tertiary-fixed" data-icon="person_off">person_off</span>
            </div>
          </div>
          <p className="text-muted-foreground text-caption font-semibold">Guest Shoppers</p>
          <h4 className="text-headline-h2 font-headline-h2 text-primary mt-1">{guestCount}</h4>
          <p className="text-caption text-muted-foreground mt-2">{totalCustomersCount > 0 ? Math.round((guestCount / totalCustomersCount) * 100) : 0}% of total</p>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl border border-border shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-success/10 rounded-lg">
              <span className="material-symbols-outlined text-success" data-icon="workspace_premium">workspace_premium</span>
            </div>
            {topSpender && (
              <span className="text-caption font-bold text-success flex items-center">
                Top Spender
              </span>
            )}
          </div>
          <p className="text-muted-foreground text-caption font-semibold">Highest Value Client</p>
          <h4 className="text-body-lg font-bold text-primary mt-1 truncate">{topSpender?.name || 'N/A'}</h4>
          <p className="text-caption text-muted-foreground mt-2">₹{topSpender?.totalSpent.toLocaleString("en-IN") || '0'} lifetime value</p>
        </div>
      </div>

      {/* Customers Table Container */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="px-6 py-5 border-b border-border flex justify-between items-center bg-surface-container-low">
          <h3 className="font-headline-h3 text-headline-h3">Client Roster</h3>
          <div className="flex items-center bg-background rounded-lg px-3 py-1.5 gap-2 border border-border focus-within:border-secondary transition-colors">
            <span className="material-symbols-outlined text-muted-foreground text-[18px]" data-icon="search">search</span>
            <input className="bg-transparent border-none p-0 text-body-md focus:ring-0 w-48 text-sm" placeholder="Search email or name..." type="text" disabled />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-lowest border-b border-border">
                <th className="px-6 py-4 font-semibold text-caption uppercase tracking-wider text-muted-foreground">Client</th>
                <th className="px-6 py-4 font-semibold text-caption uppercase tracking-wider text-muted-foreground">Type</th>
                <th className="px-6 py-4 font-semibold text-caption uppercase tracking-wider text-muted-foreground text-right">Orders</th>
                <th className="px-6 py-4 font-semibold text-caption uppercase tracking-wider text-muted-foreground text-right">Lifetime Value</th>
                <th className="px-6 py-4 font-semibold text-caption uppercase tracking-wider text-muted-foreground">Last Order</th>
                <th className="px-6 py-4 font-semibold text-caption uppercase tracking-wider text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {allCustomers.map((customer) => {
                return (
                  <tr key={customer.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-border">
                          <Image alt={customer.name} src={customer.avatarUrl} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="text-body-md font-semibold text-primary truncate max-w-[200px]">{customer.name}</p>
                          <p className="text-caption text-muted-foreground truncate max-w-[200px]">{customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {customer.isGuest ? (
                        <span className="px-3 py-1 bg-surface-container rounded-full text-[11px] font-bold uppercase text-muted-foreground border border-border">
                          Guest Shopper
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-secondary-container/30 text-secondary-container rounded-full text-[11px] font-bold uppercase border border-secondary-container/50">
                          Registered
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-mono text-body-md font-bold text-primary">{customer.totalOrders}</span>
                    </td>
                    <td className="px-6 py-4 text-right font-label-price text-label-price text-primary">
                      ₹{customer.totalSpent.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4 text-body-md text-on-surface-variant">
                      {customer.lastOrderDate 
                        ? customer.lastOrderDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                        : "Never"}
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
        {allCustomers.length === 0 && (
          <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
            <span className="material-symbols-outlined text-[48px] mb-4 opacity-50" data-icon="group_off">group_off</span>
            <p>No customers found.</p>
          </div>
        )}
      </div>
    </>
  );
}
