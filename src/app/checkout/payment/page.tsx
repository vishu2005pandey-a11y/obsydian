"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Loader2, QrCode, Smartphone } from "lucide-react";
import toast from "react-hot-toast";

export default function UPIPaymentPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const router = useRouter();
  
  const [order, setOrder] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (!orderId) {
      router.push("/shop");
      return;
    }

    const fetchData = async () => {
      try {
        const [orderRes, settingsRes] = await Promise.all([
          fetch(`/api/orders/${orderId}`),
          fetch(`/api/settings`)
        ]);

        if (!orderRes.ok) throw new Error("Order not found");
        
        const orderData = await orderRes.json();
        const settingsData = await settingsRes.json();

        if (orderData.paymentStatus === 'paid' || orderData.paymentStatus === 'verifying') {
          router.push(`/checkout/success?orderId=${orderId}`);
          return;
        }

        setOrder(orderData);
        setSettings(settingsData);
      } catch (error) {
        toast.error("Failed to load payment details");
        router.push("/account");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId, router]);

  const handleVerify = async () => {
    setVerifying(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/verify`, {
        method: "POST"
      });
      if (!res.ok) throw new Error();
      toast.success("Payment marked for verification");
      router.push(`/checkout/success?orderId=${orderId}`);
    } catch {
      toast.error("Something went wrong");
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const upiId = settings?.upiId || "merchant@upi";
  const amount = order?.totalAmount?.toFixed(2) || "0.00";
  const upiUrl = `upi://pay?pa=${upiId}&pn=Obsydian&am=${amount}&cu=INR&tn=Order_${orderId}`;

  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-xl mx-auto bg-[#0a0a0a] border border-border rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
        <div className="bg-[#111] p-6 text-center border-b border-border">
          <h1 className="text-2xl font-serif tracking-widest text-white">COMPLETE PAYMENT</h1>
          <p className="text-gray-400 mt-2">Pay securely via UPI to confirm your order.</p>
        </div>
        
        <div className="p-8">
          <div className="flex justify-between items-center mb-8 bg-[#111] p-4 rounded-xl border border-white/5">
            <span className="text-gray-400">Amount to Pay:</span>
            <span className="text-3xl font-serif text-white tracking-widest">₹{amount}</span>
          </div>

          {/* Desktop QR View */}
          <div className="hidden md:block text-center mb-8">
            <div className="w-64 h-64 bg-white mx-auto rounded-xl p-4 flex items-center justify-center mb-4">
              {settings?.upiQrImage ? (
                <img src={settings.upiQrImage} alt="UPI QR Code" className="w-full h-full object-contain" />
              ) : (
                <div className="text-center text-gray-500 flex flex-col items-center">
                  <QrCode className="w-12 h-12 mb-2" />
                  <span>Scan QR Code via any UPI App</span>
                </div>
              )}
            </div>
            <p className="text-gray-400 text-sm">Or pay to UPI ID: <span className="text-white font-medium">{upiId}</span></p>
          </div>

          {/* Mobile Deeplinks */}
          <div className="md:hidden space-y-4 mb-8">
            <p className="text-center text-sm text-gray-400 mb-4 flex items-center justify-center gap-2">
              <Smartphone className="w-4 h-4" /> Tap to pay with installed apps
            </p>
            <a href={upiUrl} className="block">
              <Button variant="neon" className="w-full h-14 text-lg">
                Pay with UPI App
              </Button>
            </a>
            <p className="text-center text-xs text-gray-500 mt-2">
              (GPay, PhonePe, Paytm, CRED)
            </p>
            <div className="my-6 border-t border-border relative">
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0a0a0a] px-4 text-xs text-gray-500">OR PAY TO UPI ID</span>
            </div>
            <div className="bg-[#111] border border-border p-3 rounded-lg text-center font-medium text-white break-all">
              {upiId}
            </div>
          </div>

          <div className="mt-8 border-t border-border pt-6">
            <p className="text-sm text-gray-400 text-center mb-4">After completing the payment on your app, click the button below.</p>
            <Button 
              onClick={handleVerify} 
              disabled={verifying}
              className="w-full h-12 bg-white text-black hover:bg-gray-200 uppercase tracking-widest font-bold"
            >
              {verifying ? "Verifying..." : "I Have Paid"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
