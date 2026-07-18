"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Package, User as UserIcon, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = () => {
      fetch("/api/orders")
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setOrders(data);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch orders:", err);
        });
    };

    fetchOrders(); // Initial fetch
    
    // Real-time polling
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  const router = useRouter();
  useEffect(() => {
    if (session?.user?.role === 'admin') {
      router.push('/admin');
    }
  }, [session, router]);

  if (session?.user?.role === 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-gray-400">Redirecting to Admin Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-[#0a0a0a] border border-border rounded-xl p-6">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center">
                  <UserIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-white font-medium">{session?.user?.name}</h3>
                  <p className="text-gray-400 text-xs">{session?.user?.email}</p>
                </div>
              </div>
              
              <nav className="space-y-2">
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-lg transition-colors text-sm font-medium">
                  <Package className="w-4 h-4" /> Order History
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-lg transition-colors text-sm font-medium">
                  <Settings className="w-4 h-4" /> Account Settings
                </button>
                {session?.user?.role === 'admin' && (
                  <button onClick={() => window.location.href = '/admin'} className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-lg transition-colors text-sm font-medium">
                    <UserIcon className="w-4 h-4" /> Admin Dashboard
                  </button>
                )}
              </nav>
            </div>
          </div>

          {/* Main Content - Order History */}
          <div className="flex-grow">
            <h1 className="text-2xl font-serif text-white tracking-widest mb-6">ORDER HISTORY</h1>
            
            {loading ? (
              <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="border border-border rounded-xl p-6">
                    <div className="flex justify-between mb-4 pb-4 border-b border-border">
                      <Skeleton className="h-10 w-32" />
                      <Skeleton className="h-10 w-24" />
                    </div>
                    <div className="flex gap-4">
                      <Skeleton className="w-16 h-20 shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-3 w-1/3" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : orders.length > 0 ? (
              <div className="space-y-6">
                {orders.map((order: any) => (
                  <div key={order._id} className="bg-background/50 border border-border rounded-xl p-6">
                    <div className="flex flex-wrap justify-between items-center gap-4 border-b border-border pb-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Order #{order._id}</p>
                        <p className="text-sm text-gray-300">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-4">
                        <div className="text-right">
                          <p className="text-xs text-gray-500 mb-1">Total</p>
                          <p className="text-sm text-white font-serif">₹{order.totalAmount.toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 mb-1">Status</p>
                          <span className={`text-xs px-2 py-1 rounded tracking-wider uppercase ${
                            order.orderStatus === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                          order.orderStatus === 'shipped' ? 'bg-blue-500/10 text-blue-500' :
                          order.orderStatus === 'delivered' ? 'bg-green-500/10 text-green-500' :
                          'bg-red-500/10 text-red-500'
                        }`}>
                          {order.orderStatus}
                        </span>
                      </div>
                      
                      {/* Payment Status Real-time Display */}
                      <div className="text-right ml-4 border-l border-border pl-4">
                        <p className="text-xs text-gray-500 mb-1">Payment</p>
                        <span className={`text-xs px-2 py-1 rounded tracking-wider uppercase ${
                          order.paymentStatus === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                          order.paymentStatus === 'verifying' ? 'bg-blue-500/10 text-blue-500' :
                          order.paymentStatus === 'paid' ? 'bg-green-500/10 text-green-500' :
                          'bg-red-500/10 text-red-500'
                        }`}>
                          {order.paymentStatus}
                        </span>
                      </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {order.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex gap-4">
                          <div className="w-16 h-20 bg-[#111] rounded border border-border shrink-0">
                            {item.product?.images?.[0] && <img src={item.product.images[0]} alt={item.product?.name} className="w-full h-full object-cover rounded" />}
                          </div>
                          <div>
                            <p className="text-sm text-white">{item.product?.name || 'Product unavailable'}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Qty: {item.qty} | Price: ₹{item.price.toFixed(2)}
                            </p>
                            {(item.size || item.color) && (
                              <p className="text-xs text-gray-500 mt-1">
                                {item.size && `Size: ${item.size}`} {item.color && `| Color: ${item.color}`}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 border border-border rounded-xl border-dashed">
                <p className="text-gray-400 mb-4">You haven't placed any orders yet.</p>
                <Button onClick={() => window.location.href = '/shop'} variant="outline">Start Shopping</Button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
