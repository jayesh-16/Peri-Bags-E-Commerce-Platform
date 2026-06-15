"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export const navItems = [
  { name: "Dashboard", href: "/admin", icon: "dashboard" },
  { name: "Products", href: "/admin/products", icon: "shopping_bag" },
  { name: "Categories", href: "/admin/categories", icon: "category" },
  { name: "Orders", href: "/admin/orders", icon: "shopping_cart" },
  { name: "Customers", href: "/admin/customers", icon: "group" },
  { name: "Reviews", href: "/admin/reviews", icon: "reviews" },
  { name: "Banners", href: "/admin/banners", icon: "view_carousel" },
  { name: "Content", href: "/admin/content", icon: "article" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex h-screen w-64 fixed left-0 top-0 bg-surface-container-low dark:bg-surface-container-lowest shadow-sm flex-col py-component-padding px-4 z-50">
      <div className="mb-8 px-2">
        <h1 className="font-display-hero text-headline-h2 text-primary dark:text-primary-fixed">
          Peri Bags
        </h1>
        <p className="font-body-md text-caption text-muted-foreground mt-1">
          Artisanal Admin
        </p>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-3 transition-colors duration-200 ${
                isActive
                  ? "text-primary font-bold border-r-4 border-secondary-container bg-surface-container-high"
                  : "text-muted-foreground font-medium hover:text-primary hover:bg-surface-container"
              }`}
            >
              <span
                className={`material-symbols-outlined ${
                  isActive ? "sidebar-active" : ""
                }`}
                data-icon={item.icon}
              >
                {item.icon}
              </span>
              <span className="font-body-md">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-border pt-4 space-y-1">
        <Link href="/admin/support" className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-primary text-on-primary rounded-full font-label-button text-label-button hover:bg-primary/90 transition-all mb-4">
          <span
            className="material-symbols-outlined text-[18px]"
            data-icon="contact_support"
          >
            contact_support
          </span>
          Support
        </Link>
        <Link
          href="/admin/settings"
          className="flex items-center gap-3 px-3 py-2 text-muted-foreground font-medium hover:text-primary hover:bg-surface-container transition-colors duration-200"
        >
          <span className="material-symbols-outlined" data-icon="settings">
            settings
          </span>
          <span className="font-body-md">Settings</span>
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-3 px-3 py-2 text-muted-foreground font-medium hover:text-primary hover:bg-surface-container transition-colors duration-200"
        >
          <span className="material-symbols-outlined" data-icon="logout">
            logout
          </span>
          <span className="font-body-md">Logout</span>
        </button>
      </div>
    </aside>
  );
}
