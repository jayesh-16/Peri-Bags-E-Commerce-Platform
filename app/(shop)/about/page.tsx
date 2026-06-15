import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Peri Bags",
  description: "Learn about the heritage and craftsmanship behind Peri Bags.",
};

export default async function AboutPage() {
  const contentRecord = await prisma.siteContent.findUnique({
    where: { key: "about_us" },
  });

  const content = contentRecord?.value || "<h2>Our Story</h2><p>Content is currently being updated. Please check back soon.</p>";

  return (
    <main className="flex-grow pt-32 pb-24 bg-surface">
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <div className="mb-12 text-center">
          <span className="text-secondary font-medium uppercase tracking-widest-plus text-[11px] mb-4 block">
            Our Heritage
          </span>
          <h1 className="font-display text-5xl md:text-6xl text-primary mb-6">
            About Peri Bags
          </h1>
          <div className="h-px w-24 bg-border mx-auto"></div>
        </div>

        <div 
          className="prose prose-lg prose-headings:font-display prose-headings:text-primary prose-p:font-body prose-p:text-on-surface-variant prose-p:leading-loose prose-p:tracking-wide prose-a:text-secondary prose-a:font-semibold prose-strong:text-primary hover:prose-a:text-primary transition-colors max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />

        <div className="mt-20 pt-10 border-t border-border flex justify-center">
          <Link href="/products" className="btn-magnetic px-8 py-4 bg-primary text-on-primary font-label-button text-[12px] uppercase tracking-widest rounded-full hover:bg-secondary transition-all shadow-md">
            Explore the Collection
          </Link>
        </div>
      </div>
    </main>
  );
}
