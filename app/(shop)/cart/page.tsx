'use client';

import { useCart } from '@/hooks/use-cart';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, ArrowRight, ShoppingBag, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CartPage() {
  const [isMounted, setIsMounted] = useState(false);
  const { items, removeItem, updateQuantity, getTotal } = useCart();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-section-block text-center text-on-surface-variant">Loading cart...</main>;
  }

  if (items.length === 0) {
    return (
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-section-block flex flex-col items-center justify-center text-center min-h-[60vh]">
        <div className="bg-surface-container-low p-8 rounded-full mb-8 shadow-sm">
          <ShoppingBag className="h-16 w-16 text-secondary" strokeWidth={1.5} />
        </div>
        <h1 className="font-display-hero-mobile text-display-hero-mobile text-primary mb-4 tracking-tight">Your Cart is Empty</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-md mx-auto">
          Looks like you haven&apos;t added anything to your cart yet. Discover our premium collection of artisanal bags.
        </p>
        <Link href="/products" className="bg-primary text-on-primary font-label-button text-label-button px-10 py-4 rounded-full hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 shadow-sm">
          Start Shopping
        </Link>
      </main>
    );
  }

  const subtotal = getTotal();
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  return (
    <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-section-block">
      <header className="mb-section-inner border-b border-border pb-6">
        <h1 className="font-display-hero-mobile md:font-headline-h1 text-display-hero-mobile md:text-headline-h1 text-primary mb-2 tracking-tight">Your Cart</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">Review your selections before proceeding to checkout.</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-section-inner items-start mt-8">
        {/* Cart Items List */}
        <section className="w-full lg:w-2/3 space-y-6">
          {items.map(({ product, quantity }) => (
            <article key={product.id} className="flex flex-col sm:flex-row bg-surface-container-lowest rounded-lg p-card-padding shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-shadow duration-300 gap-6 relative group border border-border/50">
              <button 
                aria-label="Remove item" 
                className="absolute top-4 right-4 text-on-surface-variant hover:text-error transition-colors focus:outline-none"
                onClick={() => removeItem(product.id)}
              >
                <X className="h-5 w-5" />
              </button>
              
              <div className="w-full sm:w-32 aspect-square rounded-lg overflow-hidden bg-surface-container-low flex-shrink-0">
                {product.images[0] && (
                  <Image 
                    src={product.images[0].url} 
                    alt={product.name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                )}
              </div>
              
              <div className="flex flex-col justify-between flex-grow py-1">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-success/10 text-success text-[11px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full">In Stock</span>
                  </div>
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="font-headline-h3 text-headline-h3 text-primary mb-1 hover:text-secondary transition-colors">{product.name}</h3>
                  </Link>
                  <p className="font-caption text-caption text-on-surface-variant mb-4">Premium Leather</p>
                </div>
                
                <div className="flex flex-wrap items-center justify-between gap-4 mt-auto">
                  <div className="flex items-center bg-surface border border-border rounded-full p-1 shadow-sm">
                    <button 
                      aria-label="Decrease quantity" 
                      className="w-8 h-8 flex items-center justify-center text-primary hover:text-secondary hover:bg-secondary/10 rounded-full transition-colors"
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-label-button text-label-button text-primary">{quantity}</span>
                    <button 
                      aria-label="Increase quantity" 
                      className="w-8 h-8 flex items-center justify-center text-primary hover:text-secondary hover:bg-secondary/10 rounded-full transition-colors"
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="font-label-price text-label-price text-primary">₹{(product.price * quantity).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* Order Summary */}
        <aside className="w-full lg:w-1/3 sticky top-32">
          <div className="bg-surface-container-lowest rounded-xl p-card-padding shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-border">
            <h2 className="font-headline-h2 text-headline-h2 text-primary mb-6 border-b border-border pb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center text-on-surface-variant font-body-md text-body-md">
                <span>Subtotal</span>
                <span className="font-medium text-primary">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center text-on-surface-variant font-body-md text-body-md">
                <span>Shipping</span>
                <span className="font-medium text-success">Complimentary</span>
              </div>
            </div>
            
            <div className="border-t border-border pt-6 mb-8 flex justify-between items-end">
              <span className="font-headline-h3 text-headline-h3 text-primary">Total</span>
              <span className="font-headline-h2 text-headline-h2 text-primary">₹{total.toLocaleString('en-IN')}</span>
            </div>
            
            <Link href="/checkout" className="w-full flex items-center justify-center bg-primary text-on-primary font-label-button text-label-button py-4 rounded-full hover:bg-primary/90 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 shadow-md group">
              Proceed to Checkout
              <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <div className="mt-6 text-center">
              <Link href="/products" className="inline-block font-label-button text-label-button text-secondary border-b border-transparent hover:border-secondary transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
