'use client';
import { toast } from 'sonner';

interface Customer {
  id: string;
  email: string;
  name: string;
  isGuest: boolean;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: Date | null;
  joinedDate: Date;
}

export default function ExportCustomersButton({ customers }: { customers: Customer[] }) {
  const handleExport = () => {
    if (customers.length === 0) {
      toast.error("No customers to export.");
      return;
    }
    
    const headers = ['Name', 'Email', 'Type', 'Total Orders', 'Total Spent', 'Joined Date'];
    const csvContent = [
      headers.join(','),
      ...customers.map(customer => {
        const type = customer.isGuest ? 'Guest' : 'Registered';
        const joinedDate = new Date(customer.joinedDate).toLocaleDateString("en-US");
        return `"${customer.name}","${customer.email}","${type}","${customer.totalOrders}","${customer.totalSpent}","${joinedDate}"`;
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `customers_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button 
      onClick={handleExport}
      className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-label-button text-label-button flex items-center gap-2 hover:opacity-90 transition-all shadow-sm"
    >
      <span className="material-symbols-outlined text-[18px]" data-icon="download">download</span>
      Export Customers
    </button>
  );
}
