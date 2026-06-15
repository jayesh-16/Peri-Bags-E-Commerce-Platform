"use client";

import { useState } from "react";
import { Trash2, Edit, AlertCircle } from "lucide-react";
import { deleteCategory } from "@/app/admin/categories/actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function CategoryActionMenu({ category }: { category: { id: string, name: string, _count?: { products: number } } }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteCategory(category.id);
    setIsDeleting(false);
    
    if (result.error) {
      alert(result.error); // Basic error handling for now, can be improved with toasts
    } else {
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-end gap-2">
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent" onClick={() => toast.info("Edit functionality coming soon in V2")}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => setShowDeleteModal(true)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-surface border border-border shadow-lg rounded-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center flex-shrink-0 text-error">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-headline-h3 text-headline-h3 text-foreground">Delete Category</h3>
                  <p className="font-body-md text-caption text-muted-foreground mt-1">
                    Are you sure you want to delete &quot;{category.name}&quot;?
                  </p>
                </div>
              </div>
              
              <div className="bg-surface-container p-4 rounded-lg border border-border mb-6">
                <p className="font-body-md text-body-md text-muted-foreground">
                  <strong className="text-foreground">Warning:</strong> This action cannot be undone. 
                  {(category._count?.products ?? 0) > 0 && (
                    <span className="text-error font-semibold block mt-2">
                      This category currently has {category._count?.products} products associated with it. You must reassign or delete these products before you can delete this category.
                    </span>
                  )}
                </p>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-6 py-2.5 rounded-full font-label-button text-label-button text-foreground hover:bg-surface-container transition-colors"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting || (category._count?.products ?? 0) > 0}
                  className="px-6 py-2.5 rounded-full font-label-button text-label-button bg-error text-on-error hover:bg-error/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-on-error/30 border-t-on-error rounded-full animate-spin"></span>
                      Deleting...
                    </>
                  ) : (
                    "Delete Category"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
