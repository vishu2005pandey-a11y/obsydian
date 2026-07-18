"use client";

import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";

const checkoutSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(1, "Zip code is required"),
  country: z.string().min(1, "Country is required"),
  paymentMethod: z.enum(["UPI", "COD"]),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { data: session } = useSession();
  const { items, getCartTotal, clearCart } = useCartStore();
  const total = getCartTotal();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: session?.user?.email || "",
      firstName: session?.user?.name?.split(" ")[0] || "",
      lastName: session?.user?.name?.split(" ")[1] || "",
      paymentMethod: "COD"
    }
  });

  const onSubmit = async (data: CheckoutFormValues) => {
    if (!session?.user) {
      toast.error("Please login to complete your order");
      router.push("/login?callbackUrl=/checkout");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsLoading(true);

    try {
      const formattedItems = items.map(item => ({
        product: item.id,
        qty: item.qty,
        size: item.size,
        color: item.color,
        price: item.price
      }));

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: formattedItems,
          shippingAddress: {
            street: data.street,
            city: data.city,
            state: data.state,
            zip: data.zip,
            country: data.country
          },
          totalAmount: total,
          paymentMethod: data.paymentMethod
        }),
      });

      const orderData = await res.json();
      if (!res.ok) throw new Error(orderData.message || "Failed to place order");
      
      clearCart();
      
      if (data.paymentMethod === "UPI") {
        router.push(`/checkout/payment?orderId=${orderData._id}`);
      } else {
        router.push(`/checkout/success?orderId=${orderData._id}`);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl text-white mb-4">Your cart is empty</h1>
        <Button onClick={() => router.push("/shop")}>Return to Shop</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 md:px-6">
        <h1 className="text-3xl font-serif text-white tracking-widest mb-8 border-b border-border pb-4">CHECKOUT</h1>
        
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-2/3">
            <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div>
                <h2 className="text-xl text-white mb-4 font-medium tracking-wide">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input placeholder="First Name" {...register("firstName")} className={errors.firstName ? "border-red-500" : ""} />
                  <Input placeholder="Last Name" {...register("lastName")} className={errors.lastName ? "border-red-500" : ""} />
                  <Input placeholder="Email Address" type="email" {...register("email")} className={`md:col-span-2 ${errors.email ? "border-red-500" : ""}`} />
                </div>
              </div>

              <div>
                <h2 className="text-xl text-white mb-4 font-medium tracking-wide">Shipping Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input placeholder="Street Address" {...register("street")} className={`md:col-span-2 ${errors.street ? "border-red-500" : ""}`} />
                  <Input placeholder="City" {...register("city")} className={errors.city ? "border-red-500" : ""} />
                  <Input placeholder="State / Province" {...register("state")} className={errors.state ? "border-red-500" : ""} />
                  <Input placeholder="Postal / Zip Code" {...register("zip")} className={errors.zip ? "border-red-500" : ""} />
                  <Input placeholder="Country" {...register("country")} className={errors.country ? "border-red-500" : ""} />
                </div>
              </div>
              
              <div>
                <h2 className="text-xl text-white mb-4 font-medium tracking-wide">Payment Method</h2>
                <div className="space-y-4">
                  <div className={`border rounded-lg p-4 cursor-pointer transition-colors ${errors.paymentMethod ? 'border-red-500' : 'border-border bg-[#111] hover:border-gray-500'}`}>
                    <label className="flex items-center gap-3 cursor-pointer w-full">
                      <input 
                        type="radio" 
                        value="UPI" 
                        {...register("paymentMethod")}
                        className="w-4 h-4 text-primary bg-background border-gray-600 focus:ring-primary focus:ring-2"
                      />
                      <span className="text-white font-medium">UPI (GPay, PhonePe, Paytm)</span>
                    </label>
                  </div>
                  <div className={`border rounded-lg p-4 cursor-pointer transition-colors ${errors.paymentMethod ? 'border-red-500' : 'border-border bg-[#111] hover:border-gray-500'}`}>
                    <label className="flex items-center gap-3 cursor-pointer w-full">
                      <input 
                        type="radio" 
                        value="COD" 
                        {...register("paymentMethod")}
                        className="w-4 h-4 text-primary bg-background border-gray-600 focus:ring-primary focus:ring-2"
                      />
                      <span className="text-white font-medium">Cash on Delivery (COD)</span>
                    </label>
                  </div>
                  {errors.paymentMethod && <p className="text-red-500 text-sm mt-1">{errors.paymentMethod.message}</p>}
                </div>
              </div>
            </form>
          </div>
          
          <div className="lg:w-1/3">
            <div className="bg-[#0a0a0a] border border-border rounded-xl p-6 sticky top-24">
              <h2 className="text-xl font-serif text-white tracking-widest mb-6 border-b border-border pb-4">ORDER SUMMARY</h2>
              
              <div className="space-y-4 mb-6 border-b border-border pb-6 max-h-64 overflow-y-auto pr-2">
                {items.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="relative w-16 h-20 bg-[#111] rounded border border-border shrink-0">
                      {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />}
                      <span className="absolute -top-2 -right-2 bg-gray-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                        {item.qty}
                      </span>
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-white text-sm line-clamp-2 leading-tight mb-1">{item.name}</h4>
                      <div className="text-xs text-gray-500 flex flex-col">
                        {item.size && <span>Size: {item.size}</span>}
                        {item.color && <span>Color: {item.color}</span>}
                      </div>
                    </div>
                    <div className="text-white text-sm font-medium">
                      ₹{(item.price * item.qty).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-sm mb-6 border-b border-border pb-6">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white">₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className="text-white">Free</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-8">
                <span className="text-white font-medium">Total</span>
                <span className="text-2xl font-serif text-white">₹{total.toFixed(2)}</span>
              </div>
              
              <Button type="submit" form="checkout-form" variant="neon" className="w-full text-lg h-14" disabled={isLoading}>
                {isLoading ? "PROCESSING..." : "PLACE ORDER"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
