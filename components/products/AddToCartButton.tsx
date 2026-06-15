'use client';

import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { Product, ProductImage } from '@prisma/client';
import { ShoppingBag } from 'lucide-react';

interface AddToCartButtonProps {
  product: Product & { images: ProductImage[] };
  disabled?: boolean;
}

export function AddToCartButton({ product, disabled }: AddToCartButtonProps) {
  const addItem = useCart((state) => state.addItem);
  const { toast } = useToast();

  const handleAddToCart = () => {
    addItem(product, 1);
    toast({
      title: 'Added to Cart',
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <Button 
      size="lg" 
      onClick={handleAddToCart}
      disabled={disabled}
      className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 h-14 text-lg shadow-hover"
    >
      <ShoppingBag className="h-5 w-5 mr-2" />
      Add to Cart
    </Button>
  );
}
