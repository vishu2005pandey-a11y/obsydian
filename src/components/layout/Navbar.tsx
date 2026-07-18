"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Diamond, ShoppingBag, Menu, X, User as UserIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";

export function Navbar() {
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cartItems = useCartStore((state) => state.items);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cartItemsCount = cartItems.reduce((total, item) => total + item.qty, 0);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
        isScrolled
          ? "bg-black/80 backdrop-blur-lg border-white/10 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
          : "bg-black/40 backdrop-blur-md border-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Diamond className="w-8 h-8 text-primary group-hover:text-primary-glow transition-colors drop-shadow-[0_0_8px_rgba(124,58,237,0.8)]" />
          <div className="flex flex-col">
            <span className="font-serif text-xl tracking-[0.2em] text-white">OBSYDIAN</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm uppercase tracking-widest text-gray-300">
          <Link href="/shop" className="hover:text-primary-glow transition-colors">Shop</Link>
          <Link href="/collections" className="hover:text-primary-glow transition-colors">Collections</Link>
          <Link href="/about" className="hover:text-primary-glow transition-colors">About</Link>
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/cart" className="relative group">
            <ShoppingBag className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
            {mounted && cartItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </Link>
          
          {session ? (
            <div className="flex items-center gap-4">
              <Link href={session.user.role === 'admin' ? '/admin' : '/account'} className="text-gray-300 hover:text-white transition-colors">
                <UserIcon className="w-5 h-5" />
              </Link>
              <button 
                onClick={() => signOut()}
                className="text-xs uppercase tracking-wider text-gray-400 hover:text-red-400 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login" className="text-xs uppercase tracking-wider text-primary hover:text-primary-glow transition-colors font-medium">
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-gray-300 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center -mr-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background border-b border-border py-4 px-4 flex flex-col gap-2 shadow-xl overflow-y-auto max-h-[80vh]">
          <Link href="/shop" className="text-gray-300 uppercase tracking-widest text-sm py-3 flex items-center" onClick={() => setIsMobileMenuOpen(false)}>Shop</Link>
          <Link href="/collections" className="text-gray-300 uppercase tracking-widest text-sm py-3 flex items-center" onClick={() => setIsMobileMenuOpen(false)}>Collections</Link>
          <Link href="/cart" className="text-gray-300 uppercase tracking-widest text-sm py-3 flex items-center justify-between" onClick={() => setIsMobileMenuOpen(false)}>
            Cart {mounted && cartItemsCount > 0 && <span className="bg-primary text-white px-2 py-0.5 rounded-full text-xs">{cartItemsCount}</span>}
          </Link>
          <hr className="border-border my-2" />
          {session ? (
            <>
              <Link href={session.user.role === 'admin' ? '/admin' : '/account'} className="text-gray-300 uppercase tracking-widest text-sm py-3 flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                My Account
              </Link>
              <button 
                onClick={() => { signOut(); setIsMobileMenuOpen(false); }}
                className="text-left text-red-400 uppercase tracking-widest text-sm py-3 flex items-center"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="text-primary uppercase tracking-widest text-sm py-3 flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
              Login / Register
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
