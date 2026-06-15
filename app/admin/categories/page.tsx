import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import CategoryActionMenu from '@/components/admin/CategoryActionMenu';

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true }
      }
    },
    orderBy: { sortOrder: 'asc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold font-serif">Categories</h1>
        <Button className="bg-accent hover:bg-accent/90 text-white">
          <Plus className="h-4 w-4 mr-2" /> Add Category
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                <tr>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Description</th>
                  <th className="px-6 py-4 font-medium text-center">Products</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                      No categories found.
                    </td>
                  </tr>
                ) : (
                  categories.map((category) => (
                    <tr key={category.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative w-12 h-12 bg-muted rounded-md overflow-hidden flex-shrink-0">
                            {category.imageUrl && (
                              <Image src={category.imageUrl} alt={category.name} fill className="object-cover" />
                            )}
                          </div>
                          <div>
                            <span className="font-semibold block">{category.name}</span>
                            <span className="text-xs text-muted-foreground">/{category.slug}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground max-w-xs truncate">
                        {category.description || '-'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-full text-xs font-semibold">
                          {category._count.products}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <CategoryActionMenu category={category} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
