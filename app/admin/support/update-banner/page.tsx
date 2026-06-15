import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Updating the Homepage Banner | Support",
};

export default function UpdateBannerGuide() {
  return (
    <div className="max-w-4xl space-y-8">
      <div className="mb-8">
        <Link href="/admin/support" className="text-secondary hover:underline flex items-center gap-2 mb-4 font-body-md">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back to Support
        </Link>
        <h1 className="font-display text-4xl text-primary">Updating the Homepage Banner</h1>
        <p className="text-on-surface-variant mt-2 font-body-md">
          Learn how to change the hero banners featured on your storefront&apos;s homepage.
        </p>
      </div>

      <div className="bg-surface-container-lowest border border-border rounded-lg p-8 shadow-sm space-y-6 font-body">
        
        <div className="space-y-2">
          <h2 className="font-display text-2xl text-primary flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm">1</span>
            Access the Banners Editor
          </h2>
          <p className="text-on-surface-variant pl-11">
            Navigate to the <strong>Banners</strong> tab in the admin sidebar. This page contains all the hero carousel slides that rotate on the homepage.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="font-display text-2xl text-primary flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm">2</span>
            Edit or Add a Banner
          </h2>
          <p className="text-on-surface-variant pl-11">
            Click <strong>Add Banner</strong> to create a new slide, or select an existing one to edit it. You can define the primary <strong>Title</strong> (e.g., &quot;Summer Collection&quot;) and a short <strong>Subtitle</strong>.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="font-display text-2xl text-primary flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm">3</span>
            Upload Imagery
          </h2>
          <p className="text-on-surface-variant pl-11">
            The banner requires a high-resolution, wide-format image. We recommend using images with a subtle gradient or dark overlay so the white text remains highly legible. Provide the <strong>Image URL</strong>.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="font-display text-2xl text-primary flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm">4</span>
            Link to a Collection (Optional)
          </h2>
          <p className="text-on-surface-variant pl-11">
            If this banner promotes a specific product line or sale, paste the URL into the <strong>Link URL</strong> field. This turns the entire banner into a clickable area.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="font-display text-2xl text-primary flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm">5</span>
            Toggle Visibility
          </h2>
          <p className="text-on-surface-variant pl-11">
            Use the <strong>Is Active</strong> switch to instantly hide or show a banner without deleting it from your system. This is perfect for rotating seasonal campaigns!
          </p>
        </div>

      </div>
    </div>
  );
}
