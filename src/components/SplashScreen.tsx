"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "impro2pro:splash:seen";

export function SplashScreen() {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<"opening" | "show" | "closing" | "done">("opening");

  useEffect(() => {
    const seen = sessionStorage.getItem(STORAGE_KEY);
    if (seen) {
      setPhase("done");
      return;
    }
    setMounted(true);
    const t1 = setTimeout(() => setPhase("show"), 1200);
    const t2 = setTimeout(() => setPhase("closing"), 4800);
    const t3 = setTimeout(() => {
      sessionStorage.setItem(STORAGE_KEY, "1");
      setPhase("done");
    }, 5400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const skip = () => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setPhase("done");
  };

  if (!mounted || phase === "done") return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0610] transition-opacity duration-500 ${
        phase === "closing" ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Stage floor glow */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-amber-500/10 to-transparent" />

      {/* Marquee bulbs frame */}
      <div className="pointer-events-none absolute inset-x-6 inset-y-6 rounded-3xl border-2 border-amber-300/40 shadow-[0_0_60px_rgba(252,211,77,0.25)]">
        <Bulbs />
      </div>

      {/* Left curtain */}
      <div
        className={`absolute inset-y-0 left-0 z-20 w-1/2 origin-left transition-transform duration-[1100ms] ease-[cubic-bezier(0.65,0,0.35,1)] ${
          phase === "opening" ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background:
            "repeating-linear-gradient(90deg, #6b0f1a 0px, #8a1220 26px, #5a0a14 52px), linear-gradient(180deg, #4a0810 0%, #7a0e1a 100%)",
          backgroundBlendMode: "multiply",
          boxShadow: "inset -30px 0 60px rgba(0,0,0,0.6)",
        }}
      />
      {/* Right curtain */}
      <div
        className={`absolute inset-y-0 right-0 z-20 w-1/2 origin-right transition-transform duration-[1100ms] ease-[cubic-bezier(0.65,0,0.35,1)] ${
          phase === "opening" ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          background:
            "repeating-linear-gradient(90deg, #6b0f1a 0px, #8a1220 26px, #5a0a14 52px), linear-gradient(180deg, #4a0810 0%, #7a0e1a 100%)",
          backgroundBlendMode: "multiply",
          boxShadow: "inset 30px 0 60px rgba(0,0,0,0.6)",
        }}
      />

      {/* Top valance */}
      <div
        className="absolute inset-x-0 top-0 z-30 h-16"
        style={{
          background:
            "repeating-linear-gradient(90deg, #6b0f1a 0px, #8a1220 22px, #5a0a14 44px)",
          boxShadow: "0 12px 30px rgba(0,0,0,0.5)",
        }}
      />

      {/* Spotlights */}
      <div className="pointer-events-none absolute -top-10 left-1/3 z-10 h-[140%] w-64 -rotate-12 bg-gradient-to-b from-amber-200/30 via-amber-200/10 to-transparent blur-2xl" />
      <div className="pointer-events-none absolute -top-10 right-1/3 z-10 h-[140%] w-64 rotate-12 bg-gradient-to-b from-amber-200/30 via-amber-200/10 to-transparent blur-2xl" />

      {/* Stage content */}
      <div
        className={`relative z-10 mx-6 flex max-w-3xl flex-col items-center text-center transition-all duration-700 ${
          phase === "show" ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
      >
        <div className="relative">
          <div className="absolute -inset-6 rounded-3xl bg-amber-400/20 blur-3xl" />
          <img
            src="/troupe.png"
            alt="La troupe Impro 2pro"
            className="relative max-h-[55vh] w-auto rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.6)] ring-2 ring-amber-200/30"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        </div>

        <h1
          className="mt-8 font-marquee text-7xl font-black tracking-wide text-amber-100 md:text-8xl"
          style={{ textShadow: "0 6px 30px rgba(252,211,77,0.5)" }}
        >
          IMPRO<span className="text-red-400">2</span>PRO
        </h1>
        <div className="mt-3 inline-flex items-center gap-3 text-amber-200/90">
          <span className="h-px w-10 bg-amber-300/60" />
          <span className="font-display text-xl uppercase tracking-[0.3em]">
            La troupe entre en scène
          </span>
          <span className="h-px w-10 bg-amber-300/60" />
        </div>

        <button
          onClick={skip}
          className="mt-8 rounded-full border border-amber-200/40 bg-amber-100/10 px-5 py-2 text-xs uppercase tracking-widest text-amber-100 backdrop-blur transition hover:bg-amber-100/20"
        >
          Lever de rideau →
        </button>
      </div>
    </div>
  );
}

function Bulbs() {
  // 28 bulbs along each side, animated with staggered delay
  const positions = Array.from({ length: 28 });
  return (
    <>
      {/* top */}
      <div className="absolute inset-x-4 -top-[7px] flex justify-between">
        {positions.map((_, i) => <Bulb key={`t${i}`} index={i} />)}
      </div>
      {/* bottom */}
      <div className="absolute inset-x-4 -bottom-[7px] flex justify-between">
        {positions.map((_, i) => <Bulb key={`b${i}`} index={i + 7} />)}
      </div>
      {/* left */}
      <div className="absolute inset-y-4 -left-[7px] flex flex-col justify-between">
        {positions.slice(0, 16).map((_, i) => <Bulb key={`l${i}`} index={i + 3} />)}
      </div>
      {/* right */}
      <div className="absolute inset-y-4 -right-[7px] flex flex-col justify-between">
        {positions.slice(0, 16).map((_, i) => <Bulb key={`r${i}`} index={i + 5} />)}
      </div>
    </>
  );
}

function Bulb({ index }: { index: number }) {
  const delay = (index % 4) * 0.25;
  return (
    <span
      className="block h-3 w-3 rounded-full bg-amber-200 shadow-[0_0_10px_rgba(252,211,77,0.9)]"
      style={{
        animation: `bulbPulse 1.4s ease-in-out ${delay}s infinite`,
      }}
    />
  );
}
