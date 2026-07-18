"use client";

import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Trash2, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getCartTotal } = useCartStore();
  const total = getCartTotal();

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 fog-bg text-center">
        <ShoppingBag className="w-16 h-16 text-primary mb-6 opacity-80" />
        <h1 className="text-3xl font-serif text-white tracking-widest mb-4">YOUR CART IS EMPTY</h1>
        <p className="text-gray-400 mb-8">Discover our new arrivals and complete your look.</p>
        <Link href="/shop">
          <Button variant="neon" size="lg">Return to Shop</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 md:px-6">
        <h1 className="text-3xl font-serif text-white tracking-widest mb-8 border-b border-border pb-4">SHOPPING CART</h1>
        
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-2/3">
            <div className="hidden md:grid grid-cols-6 gap-4 text-xs text-gray-400 uppercase tracking-widest border-b border-border pb-4 mb-4">
              <div className="col-span-3">Product</div>
              <div className="text-center">Price</div>
              <div className="text-center">Quantity</div>
              <div className="text-right">Total</div>
            </div>
            
            <div className="space-y-6">
              {items.map((item, idx) => (
                <div key={`${item.id}-${idx}`} className="flex flex-col md:grid md:grid-cols-6 gap-4 items-center border-b border-border/50 pb-6">
                  <div className="col-span-3 flex gap-4 w-full">
                    <div className="w-24 h-32 bg-[#111] rounded border border-border overflow-hidden shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-600">No img</div>
                      )}
                    </div>
                    <div className="flex flex-col justify-center">
                      <Link href={`/product/${item.id}`} className="text-white hover:text-primary transition-colors font-medium text-lg mb-1">{item.name}</Link>
                      {item.size && <span className="text-sm text-gray-400">Size: {item.size}</span>}
                      {item.color && <span className="text-sm text-gray-400">Color: {item.color}</span>}
                      <button 
                        onClick={() => removeItem(item.id, item.size, item.color)}
                        className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1 mt-2 w-fit transition-colors p-2 -ml-2 min-h-[44px]"
                      >
                        <Trash2 className="w-4 h-4" /> Remove
                      </button>
                    </div>
                  </div>
                  
                  <div className="hidden md:block text-center text-white">₹{item.price.toFixed(2)}</div>
                  
                  <div className="flex items-center justify-center w-full md:w-auto mt-4 md:mt-0">
                    <div className="flex items-center border border-border rounded h-12 w-full md:w-auto max-w-[140px]">
                      <button onClick={() => updateQuantity(item.id, Math.max(1, item.qty - 1), item.size, item.color)} className="px-4 text-gray-400 hover:text-white h-full flex items-center">-</button>
                      <span className="flex-1 text-center text-white text-sm">{item.qty}</span>
                      <button onClick={() => updateQuantity(item.id, item.qty + 1, item.size, item.color)} className="px-4 text-gray-400 hover:text-white h-full flex items-center">+</button>
                    </div>
                  </div>
                  
                  <div className="hidden md:block text-right text-white font-serif tracking-wider">
                    ₹{(item.price * item.qty).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="lg:w-1/3">
            <div className="bg-[#0a0a0a] border border-border rounded-xl p-6 glow-border">
              <h2 className="text-xl font-serif text-white tracking-widest mb-6">ORDER SUMMARY</h2>
              
              <div className="space-y-4 text-sm mb-6 border-b border-border pb-6">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white">₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className="text-white">Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Taxes</span>
                  <span className="text-white">Calculated at checkout</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-8">
                <span className="text-white font-medium">Estimated Total</span>
                <span className="text-2xl font-serif text-white">₹{total.toFixed(2)}</span>
              </div>
              
              <Link href="/checkout">
                <Button variant="neon" className="w-full text-lg h-14">PROCEED TO CHECKOUT</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
