'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function OrdersToolbar({ orders }: { orders: { orderNumber: string; createdAt: Date | string; status: string; total: number; email?: string | null; user?: { name?: string | null; email?: string | null; } | null; shippingAddress?: { fullName: string; } | null; }[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState(searchParams.get('status') || 'All Statuses');
  const [amountRange, setAmountRange] = useState(searchParams.get('amount') || 'Any Amount');
  const [startDate, setStartDate] = useState(searchParams.get('startDate') || '');
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || '');

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'All Statuses' || value === 'Any Amount' || value === '') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`?${params.toString()}`);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
    updateFilters('status', e.target.value);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAmountRange(e.target.value);
    updateFilters('amount', e.target.value);
  };

  const clearFilters = () => {
    setStatus('All Statuses');
    setAmountRange('Any Amount');
    setStartDate('');
    setEndDate('');
    router.push('?');
  };

  const handleExport = () => {
    if (orders.length === 0) {
      toast.error("No orders to export.");
      return;
    }
    
    const headers = ['Order ID', 'Date', 'Customer Name', 'Customer Email', 'Status', 'Total Amount'];
    const csvContent = [
      headers.join(','),
      ...orders.map(order => {
        const name = order.user?.name || order.shippingAddress?.fullName || "Guest User";
        const email = order.user?.email || order.email || "guest@example.com";
        const date = new Date(order.createdAt).toLocaleDateString("en-US");
        return `"${order.orderNumber}","${date}","${name}","${email}","${order.status}","${order.total}"`;
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="font-headline-h1 text-headline-h1 text-primary">Orders Management</h2>
          <p className="text-body-lg text-muted-foreground mt-1">Review and manage your boutique&apos;s transaction pipeline.</p>
        </div>
        <button 
          onClick={handleExport}
          className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-label-button text-label-button flex items-center gap-2 hover:opacity-90 transition-all shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]" data-icon="download">download</span>
          Export Orders
        </button>
      </div>

      <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm mb-8 border border-border flex flex-wrap items-center gap-6">
        <div className="flex flex-col gap-1.5">
          <label className="text-caption font-semibold text-muted-foreground px-1">Date Range</label>
          <div className="flex items-center bg-muted rounded-lg px-3 py-2 gap-2 border focus-within:border-secondary-container transition-colors">
            <span className="material-symbols-outlined text-muted-foreground text-[20px]" data-icon="calendar_today">calendar_today</span>
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => {
                setStartDate(e.target.value);
                updateFilters('startDate', e.target.value);
              }}
              className="bg-transparent border-none p-0 text-body-md focus:ring-0 cursor-pointer max-w-[120px]" 
            />
            <span className="text-muted-foreground mx-1">-</span>
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => {
                setEndDate(e.target.value);
                updateFilters('endDate', e.target.value);
              }}
              className="bg-transparent border-none p-0 text-body-md focus:ring-0 cursor-pointer max-w-[120px]" 
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-caption font-semibold text-muted-foreground px-1">Order Status</label>
          <select 
            value={status}
            onChange={handleStatusChange}
            className="bg-muted border-none rounded-lg py-2 px-3 text-body-md focus:ring-2 focus:ring-secondary-container min-w-[160px]"
          >
            <option>All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-caption font-semibold text-muted-foreground px-1">Amount Range</label>
          <select 
            value={amountRange}
            onChange={handleAmountChange}
            className="bg-muted border-none rounded-lg py-2 px-3 text-body-md focus:ring-2 focus:ring-secondary-container min-w-[160px]"
          >
            <option>Any Amount</option>
            <option value="0-500">₹0 - ₹500</option>
            <option value="500-1500">₹500 - ₹1,500</option>
            <option value="1500+">₹1,500+</option>
          </select>
        </div>

        <div className="flex-1"></div>
        <button 
          onClick={clearFilters}
          className="text-secondary font-semibold text-label-button flex items-center gap-1 hover:underline transition-all"
        >
          <span className="material-symbols-outlined text-[18px]" data-icon="filter_list_off">filter_list_off</span>
          Clear Filters
        </button>
      </div>
    </>
  );
}
