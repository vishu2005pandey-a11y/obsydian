"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function CheckoutFailPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="bg-[#0a0a0a] border border-border p-12 rounded-2xl text-center max-w-lg w-full">
        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-3xl font-serif text-white tracking-widest mb-4">PAYMENT FAILED</h1>
        <p className="text-gray-400 mb-2">We could not process your payment at this time.</p>
        {orderId && (
          <p className="text-gray-500 text-sm mb-8 bg-background p-3 rounded border border-border inline-block">
            Order ID: <span className="text-white">{orderId}</span>
          </p>
        )}
        
        <div className="flex flex-col gap-4 mt-4">
          <Button variant="neon" onClick={() => router.push(`/checkout/payment?orderId=${orderId}`)}>
            Try Again
          </Button>
          <Button variant="outline" onClick={() => router.push("/shop")}>
            Return to Shop
          </Button>
        </div>
      </div>
    </div>
  );
}
