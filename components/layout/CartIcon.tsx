'use client';

import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useCart } from '@/hooks/use-cart';
import { useEffect, useState } from 'react';

export function CartIcon() {
  const [isMounted, setIsMounted] = useState(false);
  const itemCount = useCart((state) => state.getItemCount());

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Button variant="ghost" size="icon" asChild className="relative">
      <Link href="/cart">
        <ShoppingBag className="h-5 w-5" />
        {isMounted && itemCount > 0 && (
          <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-white text-xs p-0 animate-in zoom-in">
            {itemCount}
          </Badge>
        )}
      </Link>
    </Button>
  );
}
