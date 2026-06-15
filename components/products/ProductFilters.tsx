'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import type { Category } from '@prisma/client';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, X } from 'lucide-react';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface ProductFiltersProps {
  categories: Category[];
  currentCategory?: string;
  currentSort?: string;
}

export default function ProductFilters({ categories, currentCategory, currentSort = 'featured' }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');

  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/products?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearch('');
    router.push('/products');
  };

  const FilterContent = () => (
    <div className="space-y-8">
      {/* Search */}
      <div className="space-y-3">
        <h3 className="font-medium text-lg">Search</h3>
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            updateFilters('search', search || null);
          }}
          className="relative"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            type="text" 
            placeholder="Search products..." 
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h3 className="font-medium text-lg">Categories</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input 
              type="radio" 
              id="cat-all" 
              name="category"
              className="accent-accent"
              checked={!currentCategory}
              onChange={() => updateFilters('category', null)}
            />
            <Label htmlFor="cat-all" className="cursor-pointer">All Categories</Label>
          </div>
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center space-x-2">
              <input 
                type="radio" 
                id={`cat-${cat.id}`} 
                name="category"
                className="accent-accent"
                checked={currentCategory === cat.slug}
                onChange={() => updateFilters('category', cat.slug)}
              />
              <Label htmlFor={`cat-${cat.id}`} className="cursor-pointer">{cat.name}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div className="space-y-3">
        <h3 className="font-medium text-lg">Sort By</h3>
        <select 
          className="w-full p-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-accent"
          value={currentSort}
          onChange={(e) => updateFilters('sort', e.target.value)}
        >
          <option value="featured">Featured</option>
          <option value="newest">Newest Arrivals</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {/* Clear Filters */}
      {(currentCategory || searchParams.has('search') || currentSort !== 'featured') && (
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          <X className="h-4 w-4 mr-2" /> Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Filters */}
      <div className="hidden lg:block sticky top-24">
        <FilterContent />
      </div>

      {/* Mobile Filters */}
      <div className="lg:hidden mb-6 flex gap-2">
        <div className="relative flex-grow">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              updateFilters('search', search || null);
            }}
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              type="text" 
              placeholder="Search..." 
              className="pl-9 h-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="h-10 px-3">
              <Filter className="h-4 w-4 mr-2" /> Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-8">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
