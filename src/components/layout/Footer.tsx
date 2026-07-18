import Link from "next/link";
import { Diamond } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black/80 backdrop-blur-lg border-t border-white/10 pt-16 pb-8 relative z-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12">
          
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 group mb-4">
              <Diamond className="w-8 h-8 text-primary" />
              <div className="flex flex-col">
                <span className="font-serif text-xl tracking-[0.2em] text-white">OBSYDIAN</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Luxury streetwear forged in the shadows. Elevate your everyday aesthetic with premium materials and dark motifs.
            </p>
          </div>

          <div>
            <h3 className="text-white font-serif tracking-widest mb-4">SHOP</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/shop" className="hover:text-primary transition-colors">All Products</Link></li>
              <li><Link href="/shop?category=new" className="hover:text-primary transition-colors">New Arrivals</Link></li>
              <li><Link href="/shop?category=sale" className="hover:text-primary transition-colors">Sale</Link></li>
              <li><Link href="/collections" className="hover:text-primary transition-colors">Collections</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-serif tracking-widest mb-4">SUPPORT</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="/shipping" className="hover:text-primary transition-colors">Shipping Policy</Link></li>
              <li><Link href="/returns" className="hover:text-primary transition-colors">Returns & Exchanges</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-serif tracking-widest mb-4">JOIN THE CULT</h3>
            <p className="text-gray-400 text-sm mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
            <form className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="bg-background border border-border px-3 py-2 text-sm w-full focus:outline-none focus:border-primary text-white"
              />
              <button 
                type="submit" 
                className="bg-primary text-white px-4 py-2 text-sm hover:bg-primary-glow transition-colors"
              >
                SUBSCRIBE
              </button>
            </form>
          </div>

        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} OBSYDIAN CLOTHING. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-gray-300">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-300">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
