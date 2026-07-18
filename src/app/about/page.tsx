import Image from "next/image";
import { ShieldCheck, Zap, Scissors } from "lucide-react";

export const metadata = {
  title: "About Us | Obsydian",
  description: "Learn more about Obsydian, our mission, and our commitment to quality streetwear.",
};

import { SiteSettings } from "@/models/SiteSettings";
import dbConnect from "@/lib/db";

export default async function AboutPage() {
  await dbConnect();
  const settings = await SiteSettings.findOne({}).lean();
  const aboutBg = settings?.aboutBgImage || "https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?q=80&w=2070&auto=format&fit=crop";
  const storyBg = settings?.aboutStoryImage || "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=1000&auto=format&fit=crop";

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden border-b border-white/10">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30" 
          style={{ backgroundImage: `url('${aboutBg}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-serif text-white tracking-widest mb-6 mt-16">
            REDEFINING STREETWEAR
          </h1>
          <p className="text-lg md:text-xl text-gray-400 font-light tracking-wide">
            Where anime culture meets premium fashion. We don't just print on shirts; we craft wearable art for the modern renegade.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="md:w-1/2 relative group">
              <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-white/10">
                <img 
                  src={storyBg} 
                  alt="Our Design Process" 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
            </div>
            
            <div className="md:w-1/2 space-y-6">
              <h2 className="text-3xl font-serif text-white tracking-widest uppercase relative inline-block">
                Our Story
                <div className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-primary" />
              </h2>
              <p className="text-gray-400 leading-relaxed text-lg pt-4">
                Born in the underground scene and inspired by the vibrant worlds of Japanese animation, Obsydian started as a passion project among friends who were tired of low-quality graphic tees.
              </p>
              <p className="text-gray-400 leading-relaxed text-lg">
                We set out to create pieces that we actually wanted to wear—heavyweight cotton, oversized dropped-shoulder silhouettes, and prints that withstand the test of time. Every piece in our collection is meticulously designed in-house, ensuring that the artwork respects its source material while pushing the boundaries of contemporary streetwear.
              </p>
              <div className="pt-6 grid grid-cols-2 gap-8">
                <div>
                  <h4 className="text-4xl font-serif text-white mb-2">50K+</h4>
                  <p className="text-sm text-primary uppercase tracking-widest">Happy Customers</p>
                </div>
                <div>
                  <h4 className="text-4xl font-serif text-white mb-2">100%</h4>
                  <p className="text-sm text-primary uppercase tracking-widest">Original Designs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-[#0a0a0a] border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif text-white tracking-widest uppercase mb-4">The Obsydian Standard</h2>
            <p className="text-gray-400">Uncompromising quality at every step of the process.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-background border border-white/5 p-8 rounded-2xl hover:border-primary/50 transition-colors group">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                <Scissors className="w-6 h-6" />
              </div>
              <h3 className="text-xl text-white font-medium mb-3">Premium Materials</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                We exclusively use 240+ GSM heavyweight french terry cotton for our hoodies and premium bio-washed cotton for our tees to ensure maximum comfort and durability.
              </p>
            </div>
            
            <div className="bg-background border border-white/5 p-8 rounded-2xl hover:border-primary/50 transition-colors group">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl text-white font-medium mb-3">HD Puff Printing</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Our graphics utilize high-density screen printing and puff print technology, creating a textured, 3D feel that won't crack or fade after a few washes.
              </p>
            </div>
            
            <div className="bg-background border border-white/5 p-8 rounded-2xl hover:border-primary/50 transition-colors group">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl text-white font-medium mb-3">Ethical Production</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Every garment is crafted in safe, fair-wage facilities. We believe great fashion shouldn't come at the cost of human rights or environmental negligence.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
