"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import ProductActionMenu from "@/components/admin/ProductActionMenu";
import { bulkDeleteProducts, bulkUpdatePublishStatus } from "@/app/admin/products/actions";

interface ProductTableWrapperProps {
  products: any[];
}

export default function ProductTableWrapper({ products }: ProductTableWrapperProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(products.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkPublish = (status: boolean) => {
    startTransition(async () => {
      await bulkUpdatePublishStatus(selectedIds, status);
      setSelectedIds([]);
    });
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedIds.length} products? This cannot be undone.`)) {
      startTransition(async () => {
        await bulkDeleteProducts(selectedIds);
        setSelectedIds([]);
      });
    }
  };

  const allSelected = products.length > 0 && selectedIds.length === products.length;
  const someSelected = selectedIds.length > 0;

  return (
    <div>
      {/* Bulk Action Bar */}
      {someSelected && (
        <div className="bg-primary-container text-on-primary px-6 py-3 border-b border-border flex items-center justify-between animate-fade-in">
          <span className="text-body-md font-semibold">{selectedIds.length} product{selectedIds.length > 1 ? 's' : ''} selected</span>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleBulkPublish(true)}
              disabled={isPending}
              className="px-3 py-1.5 bg-surface text-primary rounded-lg text-sm font-semibold hover:bg-white/90 transition-colors disabled:opacity-50"
            >
              Publish
            </button>
            <button 
              onClick={() => handleBulkPublish(false)}
              disabled={isPending}
              className="px-3 py-1.5 bg-surface text-primary rounded-lg text-sm font-semibold hover:bg-white/90 transition-colors disabled:opacity-50"
            >
              Unpublish
            </button>
            <button 
              onClick={handleBulkDelete}
              disabled={isPending}
              className="px-3 py-1.5 bg-error text-on-error rounded-lg text-sm font-semibold hover:bg-error/90 transition-colors flex items-center gap-1 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[16px]">delete</span>
              Delete
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto product-table-container">
        <table className="w-full text-left border-collapse">
          <thead className="bg-surface-container-low text-muted-foreground font-medium text-caption uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 w-12">
                <input 
                  type="checkbox" 
                  checked={allSelected}
                  onChange={handleSelectAll}
                  className="rounded border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer" 
                />
              </th>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((prod) => {
                const isSelected = selectedIds.includes(prod.id);
                const stockPercent = Math.min((prod.stock / 100) * 100, 100);
                const isStockError = prod.stock < 10;
                const stockColor = isStockError ? "bg-error" : prod.stock === 0 ? "bg-muted-foreground" : "bg-success";
                const status = prod.isPublished ? "Published" : "Draft";
                const statusClass = prod.isPublished ? "bg-success/10 text-success" : "bg-surface-container-high text-muted-foreground";
                const statusDot = prod.isPublished ? "bg-success" : "bg-muted-foreground";
                const img = prod.images && prod.images[0]?.url ? prod.images[0].url : "https://placehold.co/400?text=No+Image";

                return (
                  <tr key={prod.id} className={`transition-colors group ${isSelected ? 'bg-primary/5' : 'hover:bg-surface-container-low/50'}`}>
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={() => handleSelectOne(prod.id)}
                        className="rounded border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer" 
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative h-14 w-14 rounded-lg bg-muted flex-shrink-0 overflow-hidden border border-border">
                          <Image alt={prod.name} src={img} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="font-semibold text-primary hover:underline cursor-pointer">{prod.name}</p>
                          <p className="text-caption text-muted-foreground">SKU: {prod.sku || "N/A"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-surface-container text-on-surface-variant rounded-full text-caption">{prod.category?.name || "Uncategorized"}</span>
                    </td>
                    <td className="px-6 py-4 font-label-price text-label-price">₹{prod.price.toLocaleString("en-IN")}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className={`text-body-md ${isStockError ? 'text-error font-medium' : ''}`}>{prod.stock} in stock</span>
                        <div className="w-24 h-1.5 bg-surface-container rounded-full mt-1">
                          <div className={`h-full rounded-full ${stockColor}`} style={{ width: `${stockPercent}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-caption font-medium ${statusClass}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`}></span>
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ProductActionMenu 
                        productId={prod.id} 
                        isPublished={prod.isPublished} 
                        currentStock={prod.stock} 
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
