import { auth } from "@/auth";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Support & Documentation | Admin",
};

export default async function AdminSupportPage() {
  // Removed unused session var
  return (
    <div className="space-y-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="font-display text-4xl text-primary">Admin Support</h1>
        <p className="text-on-surface-variant mt-2 font-body-md">
          Help, documentation, and technical support for your Peri Bags dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Developer */}
        <div className="bg-surface-container-lowest border border-border rounded-lg p-8 shadow-sm">
          <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-2xl">engineering</span>
          </div>
          <h2 className="font-display text-2xl text-primary mb-2">Technical Support</h2>
          <p className="text-on-surface-variant mb-6 font-body">
            Encountering a bug or need a new feature? Contact your development team directly.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <span className="material-symbols-outlined text-muted-foreground text-[18px]">mail</span>
              <a href="mailto:dev@peribags.com" className="text-primary font-medium hover:underline">dev@peribags.com</a>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="material-symbols-outlined text-muted-foreground text-[18px]">schedule</span>
              <span className="text-on-surface-variant">Response within 24-48 hours</span>
            </div>
          </div>
        </div>

        {/* Quick Guides */}
        <div className="bg-surface-container-lowest border border-border rounded-lg p-8 shadow-sm">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-2xl">menu_book</span>
          </div>
          <h2 className="font-display text-2xl text-primary mb-2">Documentation</h2>
          <p className="text-on-surface-variant mb-6 font-body">
            Quick guides on how to manage your storefront effectively.
          </p>
          <ul className="space-y-3">
            <li>
              <Link href="/admin/support/add-product" className="flex items-center gap-2 text-sm text-secondary hover:underline font-medium">
                <span className="material-symbols-outlined text-[16px]">article</span>
                How to add a new Product
              </Link>
            </li>
            <li>
              <Link href="/admin/support/manage-orders" className="flex items-center gap-2 text-sm text-secondary hover:underline font-medium">
                <span className="material-symbols-outlined text-[16px]">article</span>
                Managing Customer Orders
              </Link>
            </li>
            <li>
              <Link href="/admin/support/update-banner" className="flex items-center gap-2 text-sm text-secondary hover:underline font-medium">
                <span className="material-symbols-outlined text-[16px]">article</span>
                Updating the Homepage Banner
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-surface-container-lowest border border-border rounded-lg p-8 shadow-sm mt-8">
        <h2 className="font-display text-2xl text-primary mb-6">System Status</h2>
        <div className="flex items-center gap-4 p-4 bg-success/5 border border-success/20 rounded-lg">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
          </span>
          <div>
            <p className="font-medium text-success text-sm">All Systems Operational</p>
            <p className="text-xs text-success/80 mt-1">Database connection is stable. Authentication is online.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
