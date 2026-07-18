import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Star } from "lucide-react";
import { Preloader } from "@/components/Preloader";
import { HeroScroll } from "@/components/HeroScroll";
import dbConnect from "@/lib/db";
import { Product } from "@/models/Product";
import { SiteSettings } from "@/models/SiteSettings";

export const revalidate = 60; // revalidate every minute

export default async function Home() {
  await dbConnect();
  
  // Fetch latest 4 products to show as "LATEST DROPS"
  const latestProducts = await Product.find({})
    .populate("category", "name")
    .sort({ createdAt: -1 })
    .limit(4)
    .lean();

  const settings = await SiteSettings.findOne({}).lean();
  const heroBg = settings?.heroBgImage || "/hero-bg.png";
  const animeBg = settings?.animeCategoryBgImage || "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=800&auto=format&fit=crop";
  const oversizedBg = settings?.homeCategoryOversizedBgImage || "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?q=80&w=800&auto=format&fit=crop";
  const superheroBg = settings?.homeCategorySuperheroBgImage || "https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?q=80&w=800&auto=format&fit=crop";

  return (
    <div className="flex flex-col min-h-screen">
      <Preloader />
      <HeroScroll bgImage={heroBg} />

      {/* Featured Categories */}
      <section className="py-24 bg-background border-t border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-serif text-white tracking-widest mb-2">CATEGORIES</h2>
              <p className="text-gray-400">Discover our signature anime prints and oversized fits.</p>
            </div>
            <Link href="/shop" className="hidden md:flex items-center text-primary hover:text-primary-glow transition-colors uppercase tracking-widest text-sm font-medium">
              View All <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { title: "ANIME TEES", img: animeBg },
              { title: "OVERSIZED HOODIES", img: oversizedBg },
              { title: "SUPERHEROES", img: superheroBg }
            ].map((cat, i) => (
              <Link href={`/shop?category=${cat.title.toLowerCase().replace(" ", "-")}`} key={i} className="group relative h-[400px] overflow-hidden rounded-xl border border-border">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${cat.img})` }}></div>
                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors duration-500"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <h3 className="text-2xl font-serif tracking-widest text-white mb-2">{cat.title}</h3>
                  <div className="h-[2px] w-12 bg-primary group-hover:w-full transition-all duration-500"></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Drops from DB */}
      <section className="py-24 bg-[#080808]">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-serif text-white tracking-widest mb-12 text-center">LATEST DROPS</h2>
          
          {latestProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {latestProducts.map((item: any) => (
                <div key={item._id.toString()} className="group flex flex-col bg-background/50 border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-colors">
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#111]">
                    <div className="absolute top-2 left-2 z-10 bg-primary text-white text-xs px-2 py-1 rounded tracking-wider">NEW</div>
                    
                    {item.images && item.images.length > 0 ? (
                      <img src={item.images[0]} alt={item.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-600">No Image</div>
                    )}
                    
                    <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-background to-transparent">
                      <Link href={`/product/${item.slug}`}>
                        <Button variant="neon" className="w-full">View Details</Button>
                      </Link>
                    </div>
                  </div>
                  <div className="p-4 flex-grow flex flex-col">
                    <Link href={`/product/${item.slug}`} className="text-lg font-medium text-white hover:text-primary transition-colors line-clamp-1 mb-1">
                      {item.name}
                    </Link>
                    <p className="text-gray-400 text-sm mb-3">{(item.category as any)?.name || 'Uncategorized'}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-white font-serif tracking-wider">₹{item.price.toFixed(2)}</span>
                      <div className="flex text-primary">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className={`w-4 h-4 ${star <= (item.ratings || 5) ? 'fill-current' : 'text-gray-600'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-12">
              No products found. Start adding products from the admin panel!
            </div>
          )}
          
          <div className="mt-12 text-center">
            <Link href="/shop">
              <Button variant="outline" size="lg" className="px-12">View All Products</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
