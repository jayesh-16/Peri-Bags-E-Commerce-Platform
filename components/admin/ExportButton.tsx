"use client";
import { toast } from 'sonner';

interface ExportButtonProps {
  products: {
    name: string;
    price: number;
    comparePrice?: number | null;
    stock: number;
    sku?: string | null;
    isPublished: boolean;
    category?: { name: string } | null;
  }[];
}

export default function ExportButton({ products }: ExportButtonProps) {
  const handleExport = () => {
    if (!products || products.length === 0) {
      toast.error("No products to export.");
      return;
    }

    // Define CSV headers
    const headers = ["Product Name", "Category", "Price", "Compare Price", "Stock", "SKU", "Status"];
    
    // Convert products to CSV rows
    const csvRows = products.map(p => {
      return [
        `"${p.name.replace(/"/g, '""')}"`,
        `"${p.category?.name || ''}"`,
        p.price,
        p.comparePrice || '',
        p.stock,
        `"${p.sku || ''}"`,
        p.isPublished ? "Published" : "Draft"
      ].join(',');
    });

    // Combine headers and rows
    const csvString = [headers.join(','), ...csvRows].join('\n');
    
    // Create a Blob and trigger download
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `products_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button 
      onClick={handleExport}
      className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-body-md text-muted-foreground hover:bg-surface-container transition-colors"
    >
      <span className="material-symbols-outlined text-[18px]">download</span>
      <span>Export</span>
    </button>
  );
}
