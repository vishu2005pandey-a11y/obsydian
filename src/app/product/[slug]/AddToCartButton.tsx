"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/store/useCartStore";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AddToCartButton({ product }: { product: any }) {
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || "");
  const [selectedColor, setSelectedColor] = useState<string>(product.colors?.[0] || "");
  const [qty, setQty] = useState(1);
  const addItem = useCartStore(state => state.addItem);
  const router = useRouter();

  const handleAddToCart = () => {
    if (product.sizes?.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }
    
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || "",
      size: selectedSize,
      color: selectedColor,
      qty,
    });
    
    toast.success("Added to cart");
    return true;
  };

  const handleBuyNow = () => {
    if (handleAddToCart()) {
      router.push("/checkout");
    }
  };

  return (
    <div className="space-y-6">
      {product.sizes?.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-white text-sm tracking-wider">SIZE</span>
            <span className="text-gray-400 text-xs hover:text-primary cursor-pointer transition-colors">Size Guide</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {product.sizes.map((s: string) => (
              <button
                key={s}
                onClick={() => setSelectedSize(s)}
                className={`w-12 h-12 flex items-center justify-center rounded border transition-colors ${
                  selectedSize === s 
                    ? "border-primary text-white bg-primary/10" 
                    : "border-border text-gray-400 hover:border-gray-500"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {product.colors?.length > 0 && (
        <div>
          <span className="text-white text-sm tracking-wider mb-2 block">COLOR: <span className="text-gray-400">{selectedColor}</span></span>
          <div className="flex flex-wrap gap-3">
            {product.colors.map((c: string) => (
              <button
                key={c}
                onClick={() => setSelectedColor(c)}
                className={`w-8 h-8 rounded-full border-2 transition-transform ${
                  selectedColor === c ? "border-primary scale-110" : "border-transparent scale-100"
                }`}
                style={{ backgroundColor: c.toLowerCase() }}
                title={c}
              />
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 pt-4 border-t border-border">
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">Quantity:</span>
          <div className="flex items-center border border-border rounded h-10 w-32">
            <button onClick={() => setQty(Math.max(1, qty - 1))} className="flex-1 text-gray-400 hover:text-white">-</button>
            <span className="flex-1 text-center text-white">{qty}</span>
            <button onClick={() => setQty(qty + 1)} className="flex-1 text-gray-400 hover:text-white">+</button>
          </div>
        </div>
        
        <div className="flex flex-col gap-3 mt-2">
          <Button onClick={handleAddToCart} variant="outline" size="lg" className="w-full text-base h-12">
            Add to Cart
          </Button>
          <Button onClick={handleBuyNow} variant="neon" size="lg" className="w-full text-base h-12">
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
}
