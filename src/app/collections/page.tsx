import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteSettings } from "@/models/SiteSettings";
import dbConnect from "@/lib/db";

export const metadata = {
  title: "Collections | Obsydian",
  description: "Explore our exclusive streetwear collections.",
};
export default async function CollectionsPage() {
  await dbConnect();
  const settings = await SiteSettings.findOne({}).lean();
  
  const collections = [
    {
      title: "ANIME ESSENTIALS",
      description: "Premium graphics inspired by legendary animation.",
      image: settings?.collectionAnimeBgImage || "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=2069&auto=format&fit=crop",
      link: "/shop?category=anime",
      size: "large"
    },
    {
      title: "OVERSIZED HOODIES",
      description: "Heavyweight 240+ GSM french terry cotton.",
      image: settings?.collectionOversizedBgImage || "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?q=80&w=1972&auto=format&fit=crop",
      link: "/shop?category=hoodies",
      size: "medium"
    },
    {
      title: "VINTAGE WASH",
      description: "Acid washed tees with distressed details.",
      image: settings?.collectionVintageBgImage || "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=2070&auto=format&fit=crop",
      link: "/shop?category=vintage",
      size: "medium"
    },
    {
      title: "CYBERPUNK AESTHETIC",
      description: "Futuristic typography and neon accents.",
      image: settings?.collectionCyberpunkBgImage && settings.collectionCyberpunkBgImage.trim() !== "" 
        ? settings.collectionCyberpunkBgImage 
        : "https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=2070&auto=format&fit=crop",
      link: "/shop?category=cyberpunk",
      size: "large"
    }
  ];

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif text-white tracking-widest mb-4">OUR COLLECTIONS</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Browse our carefully curated collections. Each drop is designed with a specific aesthetic in mind, 
            blending underground street culture with high-end fashion elements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {collections.map((collection, idx) => (
            <Link 
              href={collection.link} 
              key={idx}
              className={`group relative overflow-hidden rounded-2xl border border-white/10 block ${
                collection.size === 'large' ? 'md:col-span-2 h-[500px]' : 'h-[400px]'
              }`}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${collection.image}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
              
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h2 className="text-3xl font-serif text-white tracking-widest mb-2">
                    {collection.title}
                  </h2>
                  <p className="text-gray-300 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    {collection.description}
                  </p>
                  
                  <div className="inline-flex items-center text-primary uppercase tracking-widest text-sm font-medium hover:text-primary-glow transition-colors">
                    Explore Collection <ArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
