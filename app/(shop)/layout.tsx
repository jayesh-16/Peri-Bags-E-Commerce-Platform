import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: 'asc' },
    select: { id: true, name: true, slug: true }
  });

  return (
    <>
      <Navbar categories={categories} />
      <main className="flex-grow flex flex-col min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
}
