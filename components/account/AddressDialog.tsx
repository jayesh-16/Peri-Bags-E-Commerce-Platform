"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { addAddress } from "@/app/actions/addresses";
import { toast } from "sonner";

export function AddressDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await addAddress(formData);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Address saved successfully");
        setOpen(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-primary text-white text-sm font-medium tracking-wide uppercase px-8 py-3 rounded-full hover:bg-secondary transition-colors whitespace-nowrap shadow-sm">
          Add New Address
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-surface border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-primary">Add New Address</DialogTitle>
          <DialogDescription className="font-body text-on-surface-variant">
            Enter your shipping details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <label htmlFor="fullName" className="text-xs uppercase tracking-widest text-on-surface-variant font-medium">Full Name</label>
              <input id="fullName" name="fullName" required className="w-full px-4 py-2 bg-muted border border-border rounded-lg font-body focus:ring-1 focus:ring-secondary outline-none" />
            </div>
            <div className="space-y-2 col-span-2">
              <label htmlFor="phone" className="text-xs uppercase tracking-widest text-on-surface-variant font-medium">Phone Number</label>
              <input id="phone" name="phone" required className="w-full px-4 py-2 bg-muted border border-border rounded-lg font-body focus:ring-1 focus:ring-secondary outline-none" />
            </div>
            <div className="space-y-2 col-span-2">
              <label htmlFor="line1" className="text-xs uppercase tracking-widest text-on-surface-variant font-medium">Address Line 1</label>
              <input id="line1" name="line1" required className="w-full px-4 py-2 bg-muted border border-border rounded-lg font-body focus:ring-1 focus:ring-secondary outline-none" />
            </div>
            <div className="space-y-2 col-span-2">
              <label htmlFor="line2" className="text-xs uppercase tracking-widest text-on-surface-variant font-medium">Address Line 2 (Optional)</label>
              <input id="line2" name="line2" className="w-full px-4 py-2 bg-muted border border-border rounded-lg font-body focus:ring-1 focus:ring-secondary outline-none" />
            </div>
            <div className="space-y-2">
              <label htmlFor="city" className="text-xs uppercase tracking-widest text-on-surface-variant font-medium">City</label>
              <input id="city" name="city" required className="w-full px-4 py-2 bg-muted border border-border rounded-lg font-body focus:ring-1 focus:ring-secondary outline-none" />
            </div>
            <div className="space-y-2">
              <label htmlFor="state" className="text-xs uppercase tracking-widest text-on-surface-variant font-medium">State/Province</label>
              <input id="state" name="state" required className="w-full px-4 py-2 bg-muted border border-border rounded-lg font-body focus:ring-1 focus:ring-secondary outline-none" />
            </div>
            <div className="space-y-2">
              <label htmlFor="postalCode" className="text-xs uppercase tracking-widest text-on-surface-variant font-medium">Postal Code</label>
              <input id="postalCode" name="postalCode" required className="w-full px-4 py-2 bg-muted border border-border rounded-lg font-body focus:ring-1 focus:ring-secondary outline-none" />
            </div>
            <div className="space-y-2">
              <label htmlFor="country" className="text-xs uppercase tracking-widest text-on-surface-variant font-medium">Country</label>
              <select id="country" name="country" required className="w-full px-4 py-2 bg-muted border border-border rounded-lg font-body focus:ring-1 focus:ring-secondary outline-none text-primary">
                <option value="India">India</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Australia">Australia</option>
                <option value="Canada">Canada</option>
              </select>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={() => setOpen(false)}
              className="px-6 py-2 rounded-full font-label-button text-sm tracking-wide text-on-surface-variant hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isPending}
              className="px-6 py-2 bg-primary text-white rounded-full font-label-button text-sm tracking-wide hover:bg-secondary transition-colors shadow-sm disabled:opacity-50"
            >
              {isPending ? "Saving..." : "Save Address"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
