"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Star, Filter, SlidersHorizontal } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  category: { name: string; slug: string };
  images: string[];
}

function ShopContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ _id: string, name: string, slug: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const categoryParam = searchParams.get("category");
  
  const [bgImage, setBgImage] = useState("/hero-bg.png"); // Default dark split wallpaper

  useEffect(() => {
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCategories(data);
      });
  }, []);

  useEffect(() => {
    if (categoryParam === "anime-tees") {
      setBgImage("/anime-bg.png");
    } else if (categoryParam === "superhero-classics") {
      setBgImage("/superhero-bg.png");
    } else if (categoryParam === "oversized-hoodies") {
      setBgImage("/hoodie-bg.png");
    } else {
      setBgImage("/hero-bg.png"); // Default fallback
    }

    const url = categoryParam ? `/api/products?category=${categoryParam}` : "/api/products";
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [categoryParam]);

  const handleCategoryChange = (slug: string) => {
    if (categoryParam === slug) {
      router.push(pathname);
    } else {
      router.push(`${pathname}?category=${slug}`);
    }
  };

  return (
    <div className="min-h-screen pb-24 relative">
      {/* Dynamic Background */}
      <div 
        className="fixed inset-0 z-0 opacity-80 bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: `url('${bgImage}')` }}
      />
      <div className="fixed inset-0 bg-black/40 z-0 pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-black/60 backdrop-blur-lg border-b border-white/10 py-12">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-white tracking-[0.2em] mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">ALL PRODUCTS</h1>
          <p className="text-gray-300 font-medium max-w-2xl mx-auto drop-shadow-[0_1px_2px_rgba(0,0,0,1)]">Browse our complete collection of dark luxury streetwear.</p>
        </div>
      </div>

        <div className="container mx-auto px-4 md:px-6 mt-12 flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 shrink-0 space-y-8 bg-black/60 backdrop-blur-md p-6 rounded-2xl border border-white/10 h-fit">
          <div>
            <h3 className="text-white font-serif tracking-widest mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
              <Filter className="w-4 h-4" /> FILTERS
            </h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-gray-300 text-sm uppercase tracking-wider mb-2">Category</h4>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <label key={cat._id} className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={categoryParam === cat.slug}
                        onChange={() => handleCategoryChange(cat.slug)}
                        className="accent-primary rounded bg-background border-border" 
                      />
                      <span className="text-gray-400 group-hover:text-white transition-colors text-sm">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-gray-300 text-sm uppercase tracking-wider mb-2">Size</h4>
                <div className="flex flex-wrap gap-2">
                  {['S', 'M', 'L', 'XL'].map((size) => (
                    <button key={size} className="w-10 h-10 border border-border rounded flex items-center justify-center text-gray-400 hover:border-primary hover:text-white transition-colors text-sm">
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-grow">
          <div className="flex justify-between items-center mb-6 bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10">
            <span className="text-white text-sm font-medium">{products.length} products found</span>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-white" />
              <select className="bg-black/50 border border-white/20 text-white text-sm rounded px-3 py-1.5 focus:outline-none focus:border-primary">
                <option value="newest">Sort by: Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-border h-[300px] rounded-xl mb-4"></div>
                  <div className="h-4 bg-border rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-border rounded w-1/4"></div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product._id} className="group flex flex-col bg-black/70 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden hover:border-primary/80 hover:shadow-[0_0_20px_rgba(217,70,239,0.3)] transition-all">
                  <div className="relative aspect-[3/4] overflow-hidden bg-black/50">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt={product.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-600">No Image</div>
                    )}
                    
                    <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-background to-transparent">
                      <Link href={`/product/${product.slug}`}>
                        <Button variant="neon" className="w-full">View Details</Button>
                      </Link>
                    </div>
                  </div>
                  <div className="p-4 flex-grow flex flex-col">
                    <Link href={`/product/${product.slug}`} className="text-lg font-medium text-white hover:text-primary transition-colors line-clamp-1 mb-1">
                      {product.name}
                    </Link>
                    <p className="text-gray-400 text-sm mb-3">{product.category?.name || 'Uncategorized'}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-white font-serif tracking-wider">₹{product.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 text-white bg-black/60 backdrop-blur-md border border-white/20 rounded-xl">
              <p className="font-medium text-lg drop-shadow-lg">No products found. Please check back later.</p>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-white">Loading...</div>}>
      <ShopContent />
    </Suspense>
  );
}
