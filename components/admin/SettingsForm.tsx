"use client";

import { useTransition } from "react";
import { saveSettings } from "@/app/actions/settings";
import { toast } from "sonner";

interface SettingsFormProps {
  initialSettings: Record<string, string>;
}

export default function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await saveSettings(formData);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Settings saved successfully");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      <div className="bg-surface-container-lowest border border-border rounded-lg p-6 shadow-sm">
        <h2 className="font-display text-2xl text-primary mb-6">General Store Information</h2>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="store_name" className="block text-sm font-medium text-on-surface-variant">Store Name</label>
            <input 
              id="store_name" 
              name="store_name" 
              defaultValue={initialSettings["store_name"] || "Peri Bags"} 
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-secondary outline-none" 
            />
            <p className="text-xs text-muted-foreground">This appears in the header and emails.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="support_email" className="block text-sm font-medium text-on-surface-variant">Support Email</label>
              <input 
                type="email"
                id="support_email" 
                name="support_email" 
                defaultValue={initialSettings["support_email"] || "concierge@peribags.com"} 
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-secondary outline-none" 
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="support_phone" className="block text-sm font-medium text-on-surface-variant">Support Phone</label>
              <input 
                id="support_phone" 
                name="support_phone" 
                defaultValue={initialSettings["support_phone"] || "+1 (800) 555-PERI"} 
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-secondary outline-none" 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-border rounded-lg p-6 shadow-sm">
        <h2 className="font-display text-2xl text-primary mb-6">Checkout & Shipping</h2>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="shipping_fee" className="block text-sm font-medium text-on-surface-variant">Flat Rate Shipping Fee ($)</label>
            <input 
              type="number"
              step="0.01"
              id="shipping_fee" 
              name="shipping_fee" 
              defaultValue={initialSettings["shipping_fee"] || "15.00"} 
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-secondary outline-none" 
            />
            <p className="text-xs text-muted-foreground">The default shipping cost applied at checkout.</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-border">
        <button 
          type="submit" 
          disabled={isPending}
          className="bg-primary text-white font-label-button uppercase tracking-wide px-8 py-3 rounded-full hover:bg-secondary transition-colors disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </form>
  );
}
