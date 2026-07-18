"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Button } from "./ui/Button";
import Link from "next/link";

export function HeroScroll({ bgImage = "/hero-bg.png" }: { bgImage?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Fade out and scale up the background image slightly on scroll
  const backgroundOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.2]);
  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  
  // Move text up and fade it out
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-80%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div ref={containerRef} className="relative h-[130vh]">
      {/* Sticky container that stays on screen for the first 100vh of scrolling */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-black">
        
        {/* Animated Background Image */}
        <motion.div 
          style={{ opacity: backgroundOpacity, scale: backgroundScale }}
          className="absolute inset-0 z-0"
        >
          {/* Custom generated split Anime/Superhero image */}
          <div className="absolute inset-0 bg-cover bg-center opacity-100" style={{ backgroundImage: `url('${bgImage}')` }} />
          {/* Subtle gradient to blend edges */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90" />
        </motion.div>

        {/* Animated Text Content */}
        <motion.div 
          style={{ y: textY, opacity: textOpacity }}
          className="relative z-10 text-center px-4 max-w-4xl mx-auto flex items-center justify-center h-full"
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.6, duration: 1 }} // Wait for preloader
            className="bg-black/60 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)]"
          >
            <h1 className="font-serif text-5xl md:text-8xl font-bold text-white tracking-widest mb-6 drop-shadow-[0_5px_5px_rgba(0,0,0,1)]">
              WEAR YOUR <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-primary-glow to-white animate-pulse drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">ANIME & HEROES</span>
            </h1>
            <p className="text-white text-lg md:text-xl mb-10 tracking-wide font-medium max-w-2xl mx-auto drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
              Premium custom-printed streetwear featuring Naruto, DBZ, Marvel, and DC. High-density graphics for the ultimate fans.
            </p>
            <Link href="/shop">
              <Button variant="neon" className="px-12 py-7 text-xl tracking-[0.2em] uppercase rounded-xl border-2 bg-black hover:bg-white hover:text-black transition-all font-bold">
                Shop Collection
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          style={{ opacity: textOpacity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.5, duration: 1 }}
        >
          <span className="text-xs uppercase tracking-[0.3em] mb-4">Scroll Down</span>
          <div className="w-[1px] h-12 bg-white/20 overflow-hidden">
            <motion.div 
              animate={{ y: [0, 48, 48] }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="w-full h-full bg-primary"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
