"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { LayoutDashboard, ShoppingBag, Users, Settings, LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  if (session?.user?.role !== "admin") {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-[#080808] border-r border-border shrink-0 md:min-h-screen">
        <div className="p-6 border-b border-border">
          <Link href="/admin" className="font-serif text-xl tracking-widest text-white block text-center">
            OBSYDIAN <span className="text-primary text-sm block tracking-[0.3em] mt-1">ADMIN</span>
          </Link>
        </div>
        <nav className="p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors text-sm font-medium">
            <LayoutDashboard className="w-4 h-4 text-primary" /> Dashboard
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors text-sm font-medium">
            <ShoppingBag className="w-4 h-4 text-primary" /> Products
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors text-sm font-medium">
            <ShoppingBag className="w-4 h-4 text-primary" /> Orders
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors text-sm font-medium">
            <Settings className="w-4 h-4 text-primary" /> Site Settings
          </Link>
          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-lg transition-colors text-sm font-medium mt-8">
            <LogOut className="w-4 h-4" /> Back to Store
          </Link>
        </nav>
      </aside>

      {/* Admin Main Content */}
      <main className="flex-grow p-6 md:p-10">
        {children}
      </main>
    </div>
  );
}
