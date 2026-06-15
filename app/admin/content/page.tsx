import { prisma } from "@/lib/prisma";
import AdminContentClient from "@/components/admin/AdminContentClient";

const DEFAULT_CONTENT = [
  { 
    key: "home_brand_story", 
    title: "Home Brand Story", 
    type: "Section", 
    value: "<h2>Artisanship Meets Utility</h2><p>At Peri Bags, we believe in the soul of leather. Each piece tells a story of patience, skill, and the pursuit of perfection. Founded in the hills of Tuscany, our workshop remains committed to the ancient traditions of hand-stitching and vegetable tanning.</p>"
  },
  { 
    key: "about_us", 
    title: "About Us", 
    type: "Page", 
    value: "<h2>Our Story</h2><p>Founded in 2012 by Julian Peri, our workshop is dedicated to the craft of leatherworking. We don't just make bags; we create companions for life's most meaningful journeys.</p>"
  },
  { 
    key: "craftsmanship_promise", 
    title: "Craftsmanship Promise", 
    type: "Detail", 
    value: "<p>Every stitch is placed by hand with precision. Our commitment to sustainability means we source only from ethically managed tanneries.</p>"
  },
  { 
    key: "shipping_policy", 
    title: "Shipping Policy", 
    type: "Policy", 
    value: "<h2>Shipping & Returns</h2><p>We offer worldwide shipping with tracked insurance. Domestic orders typically arrive in 3-5 business days. International orders may take 7-14 business days depending on customs.</p>"
  },
  { 
    key: "hero_subtext", 
    title: "Hero Subtext", 
    type: "Hero", 
    value: "Artisanal leather goods crafted for the modern journey."
  }
];

export default async function AdminContentPage() {
  // Fetch existing content
  let dbContent = await prisma.siteContent.findMany();

  // Seed default content if the table is completely empty
  if (dbContent.length === 0) {
    for (const item of DEFAULT_CONTENT) {
      await prisma.siteContent.create({
        data: {
          key: item.key,
          value: item.value,
        }
      });
    }
    dbContent = await prisma.siteContent.findMany();
  }

  // Map dbContent back to the format expected by the client component
  // (We use DEFAULT_CONTENT to map keys to titles/types since the DB only stores key/value)
  const formattedContent = dbContent.map(record => {
    const defaultMeta = DEFAULT_CONTENT.find(d => d.key === record.key);
    return {
      key: record.key,
      title: defaultMeta?.title || record.key,
      type: defaultMeta?.type || "Custom",
      value: record.value,
      updatedAt: record.updatedAt
    };
  });

  return <AdminContentClient initialContent={formattedContent} />;
}
