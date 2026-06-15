import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How to Add a New Product | Support",
};

export default function AddProductGuide() {
  return (
    <div className="max-w-4xl space-y-8">
      <div className="mb-8">
        <Link href="/admin/support" className="text-secondary hover:underline flex items-center gap-2 mb-4 font-body-md">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back to Support
        </Link>
        <h1 className="font-display text-4xl text-primary">How to Add a New Product</h1>
        <p className="text-on-surface-variant mt-2 font-body-md">
          A step-by-step guide to adding a new bag to your storefront.
        </p>
      </div>

      <div className="bg-surface-container-lowest border border-border rounded-lg p-8 shadow-sm space-y-6 font-body">
        
        <div className="space-y-2">
          <h2 className="font-display text-2xl text-primary flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm">1</span>
            Navigate to the Products Page
          </h2>
          <p className="text-on-surface-variant pl-11">
            From your admin dashboard sidebar, click on <strong>Products</strong>. This page lists all your current inventory. In the top right corner, click the <strong>Add Product</strong> button.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="font-display text-2xl text-primary flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm">2</span>
            Fill in Basic Details
          </h2>
          <p className="text-on-surface-variant pl-11">
            Enter the product&apos;s <strong>Name</strong>. The URL Slug will automatically generate. Provide a rich <strong>Description</strong> detailing the materials and craftsmanship.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="font-display text-2xl text-primary flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm">3</span>
            Set Pricing and Inventory
          </h2>
          <p className="text-on-surface-variant pl-11">
            Set the <strong>Price</strong>. Optionally, add a <strong>Compare Price</strong> to show a discount. Enter the <strong>SKU</strong> and the current <strong>Stock</strong> quantity to manage inventory tracking.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="font-display text-2xl text-primary flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm">4</span>
            Categorize
          </h2>
          <p className="text-on-surface-variant pl-11">
            Select the appropriate <strong>Category</strong> (e.g., Handbags, Travel Bags) so customers can easily filter and find this product in the catalog.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="font-display text-2xl text-primary flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm">5</span>
            Upload Images
          </h2>
          <p className="text-on-surface-variant pl-11">
            Provide high-quality, professional photos. Ensure the primary image is well-lit and shows the bag clearly, as this will be used as the thumbnail across the site.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="font-display text-2xl text-primary flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm">6</span>
            Publish
          </h2>
          <p className="text-on-surface-variant pl-11">
            Check the <strong>Is Published</strong> toggle if you want the product to be immediately visible to customers. Check <strong>Is Featured</strong> if you want it highlighted on the homepage. Click <strong>Save Product</strong>.
          </p>
        </div>

      </div>
    </div>
  );
}
