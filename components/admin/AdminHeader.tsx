"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { getAdminNotifications } from "@/app/actions/notifications";
import { navItems } from "./AdminSidebar";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export default function AdminHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState({ pendingOrders: 0, lowStockProducts: 0, total: 0 });

  useEffect(() => {
    async function fetchNotifications() {
      const data = await getAdminNotifications();
      if (data && !data.error) {
        setNotifications({
          pendingOrders: data.pendingOrders || 0,
          lowStockProducts: data.lowStockProducts || 0,
          total: data.total || 0,
        });
      }
    }
    fetchNotifications();
  }, []);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/admin/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="fixed top-0 right-0 w-full md:w-[calc(100%-16rem)] md:ml-64 z-40 bg-surface/80 dark:bg-surface-container/80 backdrop-blur-md flex justify-between items-center h-16 px-4 md:px-8 border-b md:border-none border-border">
      
      {/* Mobile Sidebar Trigger */}
      <div className="md:hidden flex items-center mr-2">
        <Sheet>
          <SheetTrigger asChild>
            <button className="text-muted-foreground hover:text-primary transition-colors p-2 -ml-2">
              <span className="material-symbols-outlined text-[28px]" data-icon="menu">
                menu
              </span>
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 flex flex-col bg-surface-container-low border-r-border">
            <SheetHeader className="p-6 pb-2 text-left border-b border-border">
              <SheetTitle className="font-display-hero text-headline-h2 text-primary dark:text-primary-fixed">
                Peri Bags
              </SheetTitle>
              <p className="font-body-md text-caption text-muted-foreground mt-1">
                Artisanal Admin
              </p>
            </SheetHeader>
            <nav className="flex-1 overflow-y-auto py-4 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SheetTrigger asChild key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-6 py-3 transition-colors duration-200 ${
                        isActive
                          ? "text-primary font-bold border-r-4 border-secondary-container bg-surface-container-high"
                          : "text-muted-foreground font-medium hover:text-primary hover:bg-surface-container"
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined ${isActive ? "sidebar-active" : ""}`}
                        data-icon={item.icon}
                      >
                        {item.icon}
                      </span>
                      <span className="font-body-md">{item.name}</span>
                    </Link>
                  </SheetTrigger>
                );
              })}
            </nav>
            <div className="border-t border-border p-4 space-y-1 mt-auto">
              <SheetTrigger asChild>
                <Link href="/admin/support" className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-primary text-on-primary rounded-full font-label-button text-label-button hover:bg-primary/90 transition-all mb-4">
                  <span className="material-symbols-outlined text-[18px]" data-icon="contact_support">contact_support</span>
                  Support
                </Link>
              </SheetTrigger>
              <SheetTrigger asChild>
                <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2 text-muted-foreground font-medium hover:text-primary hover:bg-surface-container transition-colors duration-200">
                  <span className="material-symbols-outlined" data-icon="settings">settings</span>
                  <span className="font-body-md">Settings</span>
                </Link>
              </SheetTrigger>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full flex items-center gap-3 px-3 py-2 text-muted-foreground font-medium hover:text-primary hover:bg-surface-container transition-colors duration-200"
              >
                <span className="material-symbols-outlined" data-icon="logout">logout</span>
                <span className="font-body-md">Logout</span>
              </button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex items-center bg-surface-container-low rounded-full px-3 py-1.5 w-full max-w-[200px] md:max-w-md">
        <span
          className="material-symbols-outlined text-muted-foreground"
          data-icon="search"
        >
          search
        </span>
        <input
          className="bg-transparent border-none focus:ring-0 text-body-md w-full ml-2"
          placeholder="Search orders, stock..."
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearch}
        />
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative text-muted-foreground hover:text-primary transition-colors focus:outline-none">
                <span className="material-symbols-outlined" data-icon="notifications">
                  notifications
                </span>
                {notifications.total > 0 && (
                  <span className="absolute -top-1 -right-1 bg-secondary text-[10px] text-white w-4 h-4 rounded-full flex items-center justify-center">
                    {notifications.total}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 font-body">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.total === 0 ? (
                <div className="px-2 py-4 text-sm text-center text-muted-foreground">
                  You&apos;re all caught up!
                </div>
              ) : (
                <>
                  {notifications.pendingOrders > 0 && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin/orders" className="cursor-pointer flex items-center gap-2 text-primary">
                        <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
                        <span>{notifications.pendingOrders} Pending Order(s)</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {notifications.lowStockProducts > 0 && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin/products" className="cursor-pointer flex items-center gap-2 text-secondary">
                        <span className="material-symbols-outlined text-[18px]">warning</span>
                        <span>{notifications.lowStockProducts} Low Stock Item(s)</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/admin/support" className="text-muted-foreground hover:text-primary transition-colors focus:outline-none">
            <span className="material-symbols-outlined" data-icon="help_outline">
              help_outline
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3 border-l border-border pl-4 md:pl-6 ml-2 md:ml-0">
          <div className="text-right hidden md:block">
            <p className="font-body-md font-semibold leading-tight">
              Arjun Singh
            </p>
            <p className="text-caption text-muted-foreground">Store Manager</p>
          </div>
          <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-secondary-container">
            <Image
              alt="Admin Profile"
              src="/images/placeholder_male.png"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
