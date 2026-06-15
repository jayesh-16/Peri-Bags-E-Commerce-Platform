"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { toggleWishlist } from "@/app/actions/wishlist";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface WishlistToggleIconProps {
  productId: string;
  initialInWishlist: boolean;
}

export function WishlistToggleIcon({ productId, initialInWishlist }: WishlistToggleIconProps) {
  const [isPending, startTransition] = useTransition();
  const [inWishlist, setInWishlist] = useState(initialInWishlist);
  const router = useRouter();

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to the product detail page
    e.stopPropagation();

    // Optimistic UI update
    setInWishlist(!inWishlist);

    startTransition(async () => {
      const result = await toggleWishlist(productId);
      if (result?.error) {
        // Revert optimistic update
        setInWishlist(inWishlist);
        toast.error(result.error);
        if (result.error.includes("logged in")) {
          router.push(`/login?callbackUrl=/products`);
        }
      } else {
        toast.success(result.added ? "Added to wishlist" : "Removed from wishlist");
      }
    });
  };

  return (
    <button 
      onClick={handleToggle}
      disabled={isPending}
      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"} 
      className={`absolute top-3 right-3 p-2 backdrop-blur-sm rounded-full transition-all duration-300 hover:scale-110 focus:outline-none disabled:opacity-50 ${
        inWishlist 
          ? 'bg-surface/90 text-secondary opacity-100 shadow-sm' 
          : 'bg-surface/80 text-on-surface-variant opacity-0 group-hover:opacity-100 focus:opacity-100 hover:text-secondary'
      }`}
    >
      <Heart 
        className="h-5 w-5" 
        strokeWidth={1.5} 
        fill={inWishlist ? "currentColor" : "none"} 
      />
    </button>
  );
}
