'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useCart } from '@/hooks/use-cart';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { placeOrder } from './actions';

const steps = ['Shipping', 'Review', 'Payment', 'Confirmation'];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart, removeItem } = useCart();
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmedOrderId, setConfirmedOrderId] = useState('');
  
  const { data: session } = useSession();
  
  const [shippingDetails, setShippingDetails] = useState({
    fullName: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pinCode: '',
  });

  useEffect(() => {
    if (session?.user) {
      setShippingDetails(prev => ({
        ...prev,
        fullName: prev.fullName || session.user.name || '',
        email: prev.email || session.user.email || '',
      }));
    }
  }, [session]);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    setErrorMsg('');
    
    // Prepare items for backend
    const orderItems = items.map(item => ({
      productId: item.product.id,
      quantity: item.quantity,
      price: item.product.price
    }));

    const result = await placeOrder(shippingDetails, orderItems, getTotal());
    
    setIsProcessing(false);

    if (result.error) {
      if (result.missingProductId) {
        removeItem(result.missingProductId);
        setErrorMsg(result.error);
        setCurrentStep(1); // Force them back to the review step to see the updated cart
      } else {
        setErrorMsg(result.error);
      }
      return;
    }

    if (result.success && result.orderId) {
      setConfirmedOrderId(result.orderId);
      setCurrentStep(3); // Go to Confirmation
      clearCart();
    }
  };

  if (items.length === 0 && currentStep !== 3) {
    router.push('/cart');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="font-serif text-3xl font-bold mb-8 text-center">Checkout</h1>
      
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-12 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted -z-10" />
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-accent -z-10 transition-all duration-500" 
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />
        {steps.map((step, idx) => (
          <div key={step} className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${
              idx <= currentStep ? 'bg-accent text-white' : 'bg-muted text-muted-foreground'
            }`}>
              {idx < currentStep ? <CheckCircle2 className="h-6 w-6" /> : idx + 1}
            </div>
            <span className={`mt-2 text-xs font-medium hidden sm:block ${idx <= currentStep ? 'text-foreground' : 'text-muted-foreground'}`}>
              {step}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-card shadow-card rounded-2xl p-6 md:p-8">
        {currentStep === 0 && (
          <form onSubmit={handleNext}>
            <h2 className="text-xl font-bold mb-6">Shipping Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input 
                  id="fullName" 
                  required 
                  value={shippingDetails.fullName}
                  onChange={(e) => setShippingDetails({...shippingDetails, fullName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  required 
                  value={shippingDetails.email}
                  onChange={(e) => setShippingDetails({...shippingDetails, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  required 
                  value={shippingDetails.phone}
                  onChange={(e) => setShippingDetails({...shippingDetails, phone: e.target.value})}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input 
                  id="address" 
                  required 
                  value={shippingDetails.address}
                  onChange={(e) => setShippingDetails({...shippingDetails, address: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input 
                  id="city" 
                  required 
                  value={shippingDetails.city}
                  onChange={(e) => setShippingDetails({...shippingDetails, city: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input 
                  id="state" 
                  required 
                  value={shippingDetails.state}
                  onChange={(e) => setShippingDetails({...shippingDetails, state: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pinCode">PIN Code</Label>
                <Input 
                  id="pinCode" 
                  required 
                  value={shippingDetails.pinCode}
                  onChange={(e) => setShippingDetails({...shippingDetails, pinCode: e.target.value})}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" size="lg" className="bg-accent hover:bg-accent/90 w-full sm:w-auto">
                Continue to Review
              </Button>
            </div>
          </form>
        )}

        {currentStep === 1 && (
          <div>
            <h2 className="text-xl font-bold mb-6">Order Review</h2>
            <div className="space-y-4 mb-8">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4 items-center border-b pb-4">
                  <div className="relative w-16 h-16 bg-muted rounded overflow-hidden">
                    {item.product.images[0] && (
                      <Image src={item.product.images[0].url} alt={item.product.name} fill className="object-cover" unoptimized />
                    )}
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-medium">{item.product.name}</h4>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <div className="font-semibold">
                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-muted/50 p-4 rounded-lg mb-8">
              <div className="flex justify-between mb-2"><span className="text-muted-foreground">Subtotal</span><span>₹{getTotal().toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between mb-2"><span className="text-muted-foreground">Shipping</span><span className="text-green-600">Free</span></div>
              <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t"><span >Total</span><span>₹{getTotal().toLocaleString('en-IN')}</span></div>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(0)}>Back</Button>
              <Button onClick={(e) => handleNext(e)} className="bg-accent hover:bg-accent/90">Continue to Payment</Button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h2 className="text-xl font-bold mb-6">Payment</h2>
            <div className="border rounded-lg p-4 mb-8 bg-muted/30">
              <div className="flex items-center space-x-3">
                <input type="radio" id="cod" name="payment" className="accent-accent w-4 h-4" defaultChecked />
                <Label htmlFor="cod" className="font-medium text-base">Cash on Delivery (COD)</Label>
              </div>
              <p className="text-sm text-muted-foreground ml-7 mt-2">Pay when your order arrives at your doorstep.</p>
            </div>
            <div className="border rounded-lg p-4 mb-8 opacity-50 cursor-not-allowed">
              <div className="flex items-center space-x-3">
                <input type="radio" id="online" name="payment" disabled className="w-4 h-4" />
                <Label htmlFor="online" className="font-medium text-base">Credit/Debit Card (Coming Soon)</Label>
              </div>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(1)} disabled={isProcessing}>Back</Button>
              <div className="flex flex-col items-end gap-2">
                {errorMsg && <p className="text-error text-sm font-medium">{errorMsg}</p>}
                <Button onClick={handlePlaceOrder} disabled={isProcessing} className="bg-accent hover:bg-accent/90 w-40">
                  {isProcessing ? 'Processing...' : 'Place Order'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h2 className="font-serif text-3xl font-bold mb-4">Order Confirmed!</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Thank you for your purchase. Your order <span className="font-bold text-foreground">#{confirmedOrderId}</span> has been placed successfully and will be shipped soon.
            </p>
            <Button onClick={() => router.push('/products')} className="bg-accent hover:bg-accent/90 h-12 px-8">
              Continue Shopping
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
