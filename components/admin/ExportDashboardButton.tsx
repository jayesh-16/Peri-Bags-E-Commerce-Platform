'use client';

interface Metrics {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  activeProducts: number;
  revenueGrowth: string;
  ordersToday: number;
}

export default function ExportDashboardButton({ metrics }: { metrics: Metrics }) {
  const handleExport = () => {
    const headers = ['Metric', 'Value', 'Context'];
    const csvContent = [
      headers.join(','),
      `"Total Revenue","Rs ${metrics.totalRevenue.toLocaleString('en-IN')}","Growth: ${metrics.revenueGrowth}%"`,
      `"Total Orders","${metrics.totalOrders}","Today: +${metrics.ordersToday}"`,
      `"Total Customers","${metrics.totalCustomers}",""`,
      `"Active Products","${metrics.activeProducts}",""`
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `dashboard_summary_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button 
      onClick={handleExport}
      className="flex items-center gap-2 px-6 py-2.5 bg-secondary-container text-on-secondary-container rounded-full font-label-button text-label-button hover:opacity-90 transition-all shadow-sm"
    >
      <span className="material-symbols-outlined text-[18px]" data-icon="download">download</span>
      Export Report
    </button>
  );
}
