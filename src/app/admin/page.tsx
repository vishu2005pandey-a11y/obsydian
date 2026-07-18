"use client";

import { useEffect, useState } from "react";
import { DollarSign, ShoppingBag, Users, TrendingUp } from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0
  });

  useEffect(() => {
    // In a real app, fetch these from an admin analytics API
    // Setting defaults to 0 as requested to remove fake data
    setStats({
      totalRevenue: 0,
      totalOrders: 0,
      totalProducts: 0
    });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-serif text-white tracking-widest mb-8">DASHBOARD OVERVIEW</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#0a0a0a] border border-border rounded-xl p-6 glow-border">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Total Revenue</p>
              <h3 className="text-3xl font-serif text-white">₹{stats.totalRevenue.toLocaleString()}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-green-400">
            <TrendingUp className="w-4 h-4" /> <span>+12.5% from last month</span>
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-border rounded-xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Total Orders</p>
              <h3 className="text-3xl font-serif text-white">{stats.totalOrders}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-green-400">
            <TrendingUp className="w-4 h-4" /> <span>+5.2% from last month</span>
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-border rounded-xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Total Products</p>
              <h3 className="text-3xl font-serif text-white">{stats.totalProducts}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-sm text-gray-500">Active inventory</div>
        </div>
      </div>
      
      <div className="bg-[#0a0a0a] border border-border rounded-xl p-6">
        <h2 className="text-lg font-medium text-white mb-6">Recent Orders</h2>
        <div className="text-center py-12 text-gray-500">
          Analytics chart and detailed recent orders list will go here.
        </div>
      </div>
    </div>
  );
}
