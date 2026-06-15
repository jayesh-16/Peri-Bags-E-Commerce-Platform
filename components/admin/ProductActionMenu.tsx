"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { toggleProductPublishStatus, deleteProduct, updateProductStock } from "@/app/admin/products/actions";
import { toast } from "sonner";

interface ProductActionMenuProps {
  productId: string;
  isPublished: boolean;
  currentStock: number;
}

export default function ProductActionMenu({ productId, isPublished, currentStock }: ProductActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [stockUpdateOpen, setStockUpdateOpen] = useState(false);
  const [newStock, setNewStock] = useState(currentStock.toString());
  
  const [isPending, startTransition] = useTransition();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  const handleTogglePublish = () => {
    setIsOpen(false);
    startTransition(async () => {
      await toggleProductPublishStatus(productId, isPublished);
    });
  };

  const handleDeleteClick = () => {
    setIsOpen(false);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    setDeleteConfirmOpen(false);
    startTransition(async () => {
      await deleteProduct(productId);
    });
  };

  const handleUpdateStockClick = () => {
    setIsOpen(false);
    setNewStock(currentStock.toString());
    setStockUpdateOpen(true);
  };

  const confirmUpdateStock = () => {
    const parsedStock = parseInt(newStock, 10);
    if (!isNaN(parsedStock) && parsedStock >= 0) {
      setStockUpdateOpen(false);
      startTransition(async () => {
        await updateProductStock(productId, parsedStock);
      });
    } else {
      toast.error("Please enter a valid positive number.");
    }
  };

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className="text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
      >
        {isPending ? (
          <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin mr-1"></div>
        ) : (
          <span className="material-symbols-outlined" data-icon="more_vert">more_vert</span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-surface border border-border z-10 focus:outline-none">
          <div className="py-1">
            <button
              onClick={handleTogglePublish}
              className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-container transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isPublished ? 'visibility_off' : 'visibility'}
              </span>
              {isPublished ? "Unpublish Product" : "Publish Product"}
            </button>
            <button
              onClick={handleUpdateStockClick}
              className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-container transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">inventory</span>
              Adjust Stock
            </button>
            <div className="border-t border-border my-1"></div>
            <button
              onClick={handleDeleteClick}
              className="w-full text-left px-4 py-2 text-sm text-error hover:bg-error-container hover:text-on-error-container transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">delete</span>
              Delete Product
            </button>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-surface rounded-xl border border-border shadow-lg p-6 max-w-sm w-full animate-fade-in">
            <h3 className="text-headline-h3 font-display text-primary mb-2">Delete Product?</h3>
            <p className="text-body-md text-muted-foreground mb-6">
              Are you sure you want to delete this product? This action cannot be undone and will remove it from the storefront permanently.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setDeleteConfirmOpen(false)}
                className="px-4 py-2 rounded-full text-sm font-semibold border border-border hover:bg-surface-container transition-colors"
                disabled={isPending}
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-2 rounded-full text-sm font-semibold bg-error text-on-error hover:bg-error/90 transition-colors"
                disabled={isPending}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Adjust Stock Modal */}
      {stockUpdateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-surface rounded-xl border border-border shadow-lg p-6 max-w-sm w-full animate-fade-in">
            <h3 className="text-headline-h3 font-display text-primary mb-2">Adjust Stock</h3>
            <p className="text-body-md text-muted-foreground mb-4">
              Enter the new stock count for this product. Current stock is {currentStock}.
            </p>
            <input 
              type="number" 
              min="0"
              value={newStock}
              onChange={(e) => setNewStock(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-sm focus:border-secondary outline-none mb-6"
            />
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setStockUpdateOpen(false)}
                className="px-4 py-2 rounded-full text-sm font-semibold border border-border hover:bg-surface-container transition-colors"
                disabled={isPending}
              >
                Cancel
              </button>
              <button 
                onClick={confirmUpdateStock}
                className="px-4 py-2 rounded-full text-sm font-semibold bg-primary text-on-primary hover:bg-primary/90 transition-colors"
                disabled={isPending}
              >
                Update Stock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
