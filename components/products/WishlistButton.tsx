"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { toggleWishlist } from "@/app/actions/wishlist";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface WishlistButtonProps {
  productId: string;
  initialInWishlist: boolean;
}

export function WishlistButton({ productId, initialInWishlist }: WishlistButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [inWishlist, setInWishlist] = useState(initialInWishlist);
  const router = useRouter();

  const handleToggle = () => {
    // Optimistic UI update
    setInWishlist(!inWishlist);

    startTransition(async () => {
      const result = await toggleWishlist(productId);
      if (result?.error) {
        // Revert optimistic update
        setInWishlist(inWishlist);
        toast.error(result.error);
        if (result.error.includes("logged in")) {
          router.push(`/login?callbackUrl=/product/${productId}`);
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
      className={`w-14 h-14 flex items-center justify-center border rounded-lg transition-colors group focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 active:scale-95 disabled:opacity-50
        ${inWishlist ? 'bg-secondary/10 border-secondary text-secondary' : 'bg-surface-container border-border text-primary hover:text-secondary hover:border-secondary'}`}
    >
      <Heart 
        className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" 
        strokeWidth={1.5} 
        fill={inWishlist ? "currentColor" : "none"} 
      />
    </button>
  );
}
