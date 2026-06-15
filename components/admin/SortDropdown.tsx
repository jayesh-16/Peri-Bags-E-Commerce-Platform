"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SortDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sort') || 'newest';

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', e.target.value);
    params.set('page', '1'); // Reset to first page on sort change
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="relative group inline-block">
      <select 
        className="flex items-center gap-2 px-3 py-2 pr-8 border border-border rounded-lg text-body-md text-muted-foreground hover:bg-surface-container transition-colors appearance-none cursor-pointer outline-none bg-transparent"
        value={currentSort}
        onChange={handleSortChange}
      >
        <option value="newest">Newest First</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="stock_asc">Stock: Low to High</option>
        <option value="stock_desc">Stock: High to Low</option>
      </select>
      <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground text-[18px]">expand_more</span>
    </div>
  );
}
