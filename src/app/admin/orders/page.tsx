"use client";

import { useState, useEffect } from "react";
import { Package, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/ui/Skeleton";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/orders");
    if (res.ok) {
      setOrders(await res.json());
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (id: string, field: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: status })
      });
      if (!res.ok) throw new Error();
      toast.success(`Order status updated to ${status}`);
      fetchOrders();
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-serif text-white tracking-widest mb-8">ORDERS MANAGEMENT</h1>

      <div className="bg-[#0a0a0a] border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex flex-col lg:flex-row gap-6 border-b border-border pb-6">
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-3 w-1/4" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                <div className="w-48 space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No orders found yet.</div>
        ) : (
          <div className="divide-y divide-border">
            {orders.map(order => (
              <div key={order._id} className="p-6 hover:bg-white/5 transition-colors">
                <div className="flex flex-col lg:flex-row justify-between gap-6 mb-4 pb-4 border-b border-border/50">
                  <div>
                    <h3 className="text-white font-medium mb-1">Order #{order._id}</h3>
                    <p className="text-xs text-gray-500 mb-2">{new Date(order.createdAt).toLocaleString()}</p>
                    <div className="text-sm text-gray-300">
                      <span className="text-gray-500 uppercase tracking-wider text-xs mr-2">Customer:</span> 
                      {order.user?.name || "Unknown"} | {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.country}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                      <p className="text-lg font-serif text-white">₹{order.totalAmount.toFixed(2)}</p>
                    </div>
                    
                    
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-1">Payment Status</p>
                      <select 
                        value={order.paymentStatus} 
                        onChange={(e) => updateOrderStatus(order._id, 'paymentStatus', e.target.value)}
                        className={`text-xs px-2 py-1.5 rounded uppercase tracking-wider font-medium cursor-pointer border-0 outline-none ${
                          order.paymentStatus === 'paid' ? 'bg-green-500/20 text-green-400' :
                          order.paymentStatus === 'verifying' ? 'bg-blue-500/20 text-blue-400' :
                          order.paymentStatus === 'failed' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        <option value="pending" className="bg-background text-white">PENDING</option>
                        <option value="verifying" className="bg-background text-white">VERIFYING</option>
                        <option value="paid" className="bg-background text-white">PAID</option>
                        <option value="failed" className="bg-background text-white">FAILED</option>
                      </select>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-1">Order Status</p>
                      <select 
                        value={order.orderStatus} 
                        onChange={(e) => updateOrderStatus(order._id, 'orderStatus', e.target.value)}
                        className={`text-xs px-2 py-1.5 rounded uppercase tracking-wider font-medium cursor-pointer border-0 outline-none ${
                          order.orderStatus === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          order.orderStatus === 'shipped' ? 'bg-blue-500/20 text-blue-400' :
                          order.orderStatus === 'delivered' ? 'bg-green-500/20 text-green-400' :
                          'bg-red-500/20 text-red-400'
                        }`}
                      >
                        <option value="pending" className="bg-background text-white">PENDING</option>
                        <option value="shipped" className="bg-background text-white">SHIPPED</option>
                        <option value="delivered" className="bg-background text-white">DELIVERED</option>
                        <option value="cancelled" className="bg-background text-white">CANCELLED</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Order Items</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {order.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex gap-3 bg-background/50 border border-border p-3 rounded-lg">
                        <div className="w-12 h-16 bg-[#111] rounded border border-border shrink-0 overflow-hidden">
                          {item.product?.images?.[0] ? (
                            <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600"><Package className="w-4 h-4" /></div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-white line-clamp-1" title={item.product?.name}>{item.product?.name || 'Product unavailable'}</p>
                          <div className="text-xs text-gray-400 flex flex-col mt-1">
                            <span>Qty: {item.qty} &times; ₹{item.price.toFixed(2)}</span>
                            {(item.size || item.color) && <span>{item.size} / {item.color}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
