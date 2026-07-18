"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="bg-[#0a0a0a] border border-border p-12 rounded-2xl text-center max-w-lg w-full">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h1 className="text-3xl font-serif text-white tracking-widest mb-4">ORDER SUCCESSFUL</h1>
        <p className="text-gray-400 mb-2">Thank you for your purchase!</p>
        {orderId && (
          <p className="text-gray-500 text-sm mb-8 bg-background p-3 rounded border border-border inline-block">
            Order ID: <span className="text-white">{orderId}</span>
          </p>
        )}
        
        <div className="flex flex-col gap-4 mt-4">
          <Button variant="neon" onClick={() => router.push("/account")}>
            Track Order
          </Button>
          <Button variant="outline" onClick={() => router.push("/shop")}>
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}
