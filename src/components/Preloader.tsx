"use client";

import { useEffect, useState } from "react";

export function Preloader() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <style>{`
        @keyframes preloaderFadeOut {
          0% { opacity: 1; visibility: visible; }
          90% { opacity: 1; visibility: visible; }
          100% { opacity: 0; visibility: hidden; pointer-events: none; }
        }
        @keyframes textScaleIn {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes loadingBar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0%); }
        }
        .preloader-container {
          animation: preloaderFadeOut 2.5s cubic-bezier(0.76, 0, 0.24, 1) forwards;
        }
        .preloader-text {
          animation: textScaleIn 0.5s ease-out forwards;
        }
        .preloader-bar {
          animation: loadingBar 2s ease-in-out forwards;
        }
      `}</style>

      <div
        className="preloader-container fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black overflow-hidden"
      >
        <div className="relative text-center">
          <div className="preloader-text">
            <h1 className="text-5xl md:text-8xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-primary-glow font-bold tracking-[0.2em] uppercase">
              OBSYDIAN
            </h1>
            <p className="text-primary-glow tracking-[0.5em] text-sm md:text-xl mt-4 font-bold">
              ア ニ メ
            </p>
          </div>

          <div className="w-64 h-[2px] bg-white/10 mx-auto mt-12 overflow-hidden rounded-full">
            <div
              className="preloader-bar w-full h-full bg-primary-glow shadow-[0_0_10px_#d946ef]"
            />
          </div>
        </div>
      </div>
    </>
  );
}
