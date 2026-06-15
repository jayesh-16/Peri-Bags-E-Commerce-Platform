"use client";

import { useState } from "react";
import { createBanner } from "@/app/admin/banners/actions";

export default function CreateBannerForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-muted border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center p-8 hover:bg-surface-container-low hover:border-secondary transition-all duration-300 group min-h-[300px] h-full"
      >
        <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center text-muted-foreground group-hover:text-secondary group-hover:scale-110 transition-all duration-300 shadow-sm mb-4">
          <span className="material-symbols-outlined text-[32px]">add_photo_alternate</span>
        </div>
        <h3 className="font-headline-h3 text-headline-h3 text-primary text-[20px] mb-1">Create New Banner</h3>
        <p className="font-body-md text-body-md text-muted-foreground text-center text-sm">Upload images and set promotional links.</p>
      </button>
    );
  }

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    await createBanner(formData);
    setIsOpen(false);
    setIsSubmitting(false);
  }

  return (
    <div className="bg-surface-container-lowest border border-border rounded-xl p-6 min-h-[300px] h-full shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-headline-h3 text-primary">New Banner</h3>
        <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-primary">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <form action={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-caption font-semibold text-muted-foreground block mb-1">Title (Required)</label>
          <input required type="text" name="title" className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-sm focus:border-secondary outline-none" placeholder="Summer Sale" />
        </div>
        <div>
          <label className="text-caption font-semibold text-muted-foreground block mb-1">Subtitle</label>
          <input type="text" name="subtitle" className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-sm focus:border-secondary outline-none" placeholder="Up to 50% off" />
        </div>
        <div>
          <label className="text-caption font-semibold text-muted-foreground block mb-1">Image (Required)</label>
          <input required type="file" name="image" accept="image/*" className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-sm focus:border-secondary outline-none file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-container file:text-on-primary hover:file:bg-primary hover:file:text-white transition-colors cursor-pointer" />
        </div>
        <div>
          <label className="text-caption font-semibold text-muted-foreground block mb-1">Banner Link (Where should it take the user?)</label>
          <select name="linkUrl" className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-sm focus:border-secondary outline-none appearance-none cursor-pointer">
            <option value="">No Link</option>
            <option value="/products">All Products (Shop)</option>
            <option value="/products?category=totes">Category: Totes</option>
            <option value="/products?category=backpacks">Category: Backpacks</option>
            <option value="/products?category=clutches">Category: Clutches</option>
            <option value="/about">About Us Story</option>
          </select>
        </div>

        <div className="mt-2 flex justify-end">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-primary text-on-primary px-6 py-2 rounded-lg font-label-button text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Banner'}
          </button>
        </div>
      </form>
    </div>
  );
}
