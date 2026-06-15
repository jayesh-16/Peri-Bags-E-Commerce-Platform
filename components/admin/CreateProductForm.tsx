"use client";

import { useState } from "react";
import { createProduct } from "@/app/admin/products/actions";

interface CreateProductFormProps {
  categories: { id: string; name: string }[];
}

export default function CreateProductForm({ categories }: CreateProductFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await createProduct(formData);

    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
    } else {
      setIsOpen(false);
      setIsSubmitting(false);
    }
  }

  if (!isOpen) {
    return (
      <div className="mb-8 flex justify-end">
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-primary-container text-on-primary font-label-button px-6 py-3 rounded-full flex items-center gap-2 hover:bg-primary transition-transform active:scale-95 shadow-sm"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span>ADD PRODUCT</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-low p-6 rounded-xl border border-border shadow-sm mb-8 animate-fade-in">
      <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
        <h3 className="font-display text-2xl text-primary">Create New Product</h3>
        <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-primary">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      {error && (
        <div className="bg-error-container text-on-error-container p-4 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-secondary mb-2 border-b border-border pb-1">Basic Details</h4>
            
            <div>
              <label className="text-caption font-semibold text-muted-foreground block mb-1">Product Name *</label>
              <input required type="text" name="name" className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-sm focus:border-secondary outline-none" placeholder="e.g. The Signature Tote" />
            </div>

            <div>
              <label className="text-caption font-semibold text-muted-foreground block mb-1">Category *</label>
              <select required name="categoryId" className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-sm focus:border-secondary outline-none appearance-none cursor-pointer">
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-caption font-semibold text-muted-foreground block mb-1">Description *</label>
              <textarea required name="description" rows={4} className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-sm focus:border-secondary outline-none resize-none" placeholder="Describe the bag's materials, features, and dimensions..."></textarea>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="space-y-4">
            <h4 className="font-semibold text-secondary mb-2 border-b border-border pb-1">Pricing & Inventory</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-caption font-semibold text-muted-foreground block mb-1">Price (₹) *</label>
                <input required type="number" step="0.01" min="0" name="price" className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-sm focus:border-secondary outline-none" placeholder="4999.00" />
              </div>
              <div>
                <label className="text-caption font-semibold text-muted-foreground block mb-1">Compare at Price (₹)</label>
                <input type="number" step="0.01" min="0" name="comparePrice" className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-sm focus:border-secondary outline-none" placeholder="Optional crossed-out price" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-caption font-semibold text-muted-foreground block mb-1">Stock *</label>
                <input required type="number" min="0" name="stock" defaultValue="0" className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-sm focus:border-secondary outline-none" />
              </div>
              <div>
                <label className="text-caption font-semibold text-muted-foreground block mb-1">SKU</label>
                <input type="text" name="sku" className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-sm focus:border-secondary outline-none" placeholder="e.g. TOTE-001" />
              </div>
            </div>

            <div>
              <label className="text-caption font-semibold text-muted-foreground block mb-1">Main Image *</label>
              <input required type="file" name="image" accept="image/*" className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-sm focus:border-secondary outline-none file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-container file:text-on-primary hover:file:bg-primary hover:file:text-white transition-colors cursor-pointer" />
            </div>
            
            <div className="flex gap-6 mt-4 pt-4 border-t border-border">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="isPublished" value="true" defaultChecked className="w-4 h-4 text-primary bg-surface border-border rounded focus:ring-secondary focus:ring-2" />
                <span className="text-sm font-medium text-primary">Publish Immediately</span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="isFeatured" value="true" className="w-4 h-4 text-primary bg-surface border-border rounded focus:ring-secondary focus:ring-2" />
                <span className="text-sm font-medium text-primary">Mark as Featured</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-border">
          <button 
            type="button" 
            onClick={() => setIsOpen(false)}
            className="px-6 py-2 border border-border rounded-full text-sm font-semibold hover:bg-surface-container transition-colors disabled:opacity-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-6 py-2 bg-primary text-on-primary rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                Saving...
              </>
            ) : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
