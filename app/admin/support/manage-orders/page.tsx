import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Managing Customer Orders | Support",
};

export default function ManageOrdersGuide() {
  return (
    <div className="max-w-4xl space-y-8">
      <div className="mb-8">
        <Link href="/admin/support" className="text-secondary hover:underline flex items-center gap-2 mb-4 font-body-md">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back to Support
        </Link>
        <h1 className="font-display text-4xl text-primary">Managing Customer Orders</h1>
        <p className="text-on-surface-variant mt-2 font-body-md">
          Learn how to track, update, and fulfill incoming orders.
        </p>
      </div>

      <div className="bg-surface-container-lowest border border-border rounded-lg p-8 shadow-sm space-y-6 font-body">
        
        <div className="space-y-2">
          <h2 className="font-display text-2xl text-primary flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm">1</span>
            View Incoming Orders
          </h2>
          <p className="text-on-surface-variant pl-11">
            Navigate to the <strong>Orders</strong> page from the admin sidebar. Here, you will see a chronological list of all purchases made by customers. New orders are marked as <strong>PENDING</strong> by default.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="font-display text-2xl text-primary flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm">2</span>
            Review Details
          </h2>
          <p className="text-on-surface-variant pl-11">
            Click on any order to view its full details. You can see the customer&apos;s shipping address, contact email, and an itemized breakdown of the bags they purchased.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="font-display text-2xl text-primary flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm">3</span>
            Update Status
          </h2>
          <p className="text-on-surface-variant pl-11">
            Use the status dropdown to update the order&apos;s progress. Common statuses include:
          </p>
          <ul className="list-disc text-on-surface-variant pl-16 space-y-1 mt-2">
            <li><strong>PROCESSING</strong>: The order is being crafted or prepared for shipment.</li>
            <li><strong>SHIPPED</strong>: The package has been handed over to the courier.</li>
            <li><strong>DELIVERED</strong>: The package has safely reached the customer.</li>
            <li><strong>CANCELLED</strong>: The order was voided and refunded.</li>
          </ul>
        </div>

      </div>
    </div>
  );
}
