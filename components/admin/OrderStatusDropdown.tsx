"use client";

import { useTransition } from "react";
import { updateOrderStatus } from "@/app/admin/orders/actions";

interface OrderStatusDropdownProps {
  orderId: string;
  initialStatus: string;
}

export default function OrderStatusDropdown({ orderId, initialStatus }: OrderStatusDropdownProps) {
  const [isPending, startTransition] = useTransition();

  let statusClass = "";
  let statusIconColor = "";
  switch (initialStatus.toUpperCase()) {
    case "DELIVERED":
      statusClass = "bg-success/10 text-success";
      statusIconColor = "text-success";
      break;
    case "SHIPPED":
      statusClass = "bg-secondary-container/20 text-on-secondary-container";
      statusIconColor = "text-on-secondary-container";
      break;
    case "CONFIRMED":
      statusClass = "bg-blue-100 text-blue-700";
      statusIconColor = "text-blue-700";
      break;
    case "PENDING":
    default:
      statusClass = "bg-error-container text-on-error-container";
      statusIconColor = "text-on-error-container";
      break;
  }

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    startTransition(async () => {
      await updateOrderStatus(orderId, newStatus);
    });
  };

  return (
    <div className="relative group inline-block w-40">
      <select 
        className={`w-full ${statusClass} border-none rounded-full py-1.5 px-4 text-caption font-semibold cursor-pointer appearance-none focus:ring-2 disabled:opacity-50`} 
        defaultValue={initialStatus.toLowerCase()}
        onChange={handleStatusChange}
        disabled={isPending}
      >
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="shipped">Shipped</option>
        <option value="delivered">Delivered</option>
      </select>
      {isPending ? (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
        </div>
      ) : (
        <span className={`material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${statusIconColor} text-[18px]`} data-icon="expand_more">expand_more</span>
      )}
    </div>
  );
}
