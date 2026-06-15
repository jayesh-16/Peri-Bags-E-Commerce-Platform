import { prisma } from "@/lib/prisma";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Policies | Peri Bags",
  description: "Shipping, Returns, and Store Policies for Peri Bags.",
};

export default async function PoliciesPage() {
  const contentRecord = await prisma.siteContent.findUnique({
    where: { key: "shipping_policy" },
  });

  const content = contentRecord?.value || "<h2>Shipping & Returns</h2><p>Policy content is currently being updated. Please check back soon.</p>";

  return (
    <main className="flex-grow pt-32 pb-24 bg-surface">
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <div className="mb-12 text-center">
          <span className="text-secondary font-medium uppercase tracking-widest-plus text-[11px] mb-4 block">
            Customer Care
          </span>
          <h1 className="font-display text-5xl md:text-6xl text-primary mb-6">
            Store Policies
          </h1>
          <div className="h-px w-24 bg-border mx-auto"></div>
        </div>

        <div 
          className="prose prose-lg prose-headings:font-display prose-headings:text-primary prose-h2:mt-12 prose-h2:mb-6 prose-h2:text-3xl prose-p:font-body prose-p:text-on-surface-variant prose-p:leading-loose prose-p:tracking-wide prose-li:text-on-surface-variant prose-li:leading-loose prose-a:text-secondary max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </main>
  );
}
