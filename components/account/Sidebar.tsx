"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/account", icon: "person", label: "Overview", fill: 1 },
  { href: "/account/history", icon: "history", label: "Order History", fill: 0 },
  { href: "/account/wishlist", icon: "favorite", label: "Wishlist", fill: 0 },
  { href: "/account/addresses", icon: "location_on", label: "Saved Addresses", fill: 0 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-64 flex-shrink-0">
      <div className="sticky top-24 space-y-2">
        <h2 className="font-display text-2xl font-semibold mb-6 px-4 text-primary">My Account</h2>
        <nav className="flex flex-col space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-4 px-4 py-3 transition-colors duration-200 ${
                  isActive
                    ? "text-primary font-bold border-b-2 border-secondary pb-1 bg-surface-container-low/50"
                    : "text-on-surface-variant hover:text-secondary"
                }`}
              >
                <span 
                  className="material-symbols-outlined" 
                  style={{ fontVariationSettings: `'FILL' ${isActive ? 1 : item.fill}` }}
                >
                  {item.icon}
                </span>
                <span className="font-body">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="pt-8 px-4">
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-4 py-3 text-on-surface-variant hover:text-destructive transition-colors duration-200 w-full text-left"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="font-body font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
