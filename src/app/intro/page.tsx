"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Phase = "curtain" | "spotlights" | "poster" | "title" | "cta";

const PHASE_ORDER: Phase[] = ["curtain", "spotlights", "poster", "title", "cta"];

export default function IntroPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("curtain");

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setPhase("spotlights"), 900));
    timers.push(setTimeout(() => setPhase("poster"), 1700));
    timers.push(setTimeout(() => setPhase("title"), 2700));
    timers.push(setTimeout(() => setPhase("cta"), 3700));
    return () => timers.forEach(clearTimeout);
  }, []);

  const idx = PHASE_ORDER.indexOf(phase);
  const at = (p: Phase) => idx >= PHASE_ORDER.indexOf(p);

  const enter = () => {
    try {
      sessionStorage.setItem("impro2pro:splash:seen", "1");
    } catch {}
    router.push("/");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#1a0f0a] text-ivory-50">
      {/* Backdrop sky gradient (warm) */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(900px 600px at 50% 30%, rgba(231,180,84,0.35), transparent 60%), radial-gradient(700px 400px at 50% 100%, rgba(168,42,68,0.4), transparent 60%), linear-gradient(180deg, #2a1a14 0%, #1d130f 60%, #120a07 100%)",
        }}
      />

      {/* Wooden stage floor */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[28%]"
        style={{
          background:
            "repeating-linear-gradient(90deg, rgba(0,0,0,0.18) 0px, transparent 2px, transparent 80px, rgba(0,0,0,0.18) 82px), linear-gradient(180deg, rgba(122,72,17,0.55), rgba(40,18,8,0.95))",
          boxShadow: "inset 0 80px 60px -40px rgba(0,0,0,0.6)",
        }}
      />

      {/* Marquise frame */}
      <div className="pointer-events-none absolute inset-x-6 inset-y-6 rounded-[36px] border-2 border-gold-300/50 shadow-[0_0_60px_rgba(252,211,77,0.25)] md:inset-x-10 md:inset-y-10">
        <MarqueeBulbs />
      </div>

      {/* Spotlights */}
      <div
        className={`pointer-events-none absolute -top-10 left-[18%] z-10 h-[110%] w-72 origin-top bg-gradient-to-b from-amber-200/30 via-amber-200/8 to-transparent blur-2xl transition-opacity duration-700 ${
          at("spotlights") ? "opacity-100" : "opacity-0"
        }`}
        style={{ transform: "rotate(-12deg)", animation: at("spotlights") ? "spotSweep 6s ease-in-out infinite" : undefined }}
      />
      <div
        className={`pointer-events-none absolute -top-10 right-[18%] z-10 h-[110%] w-72 origin-top bg-gradient-to-b from-amber-200/30 via-amber-200/8 to-transparent blur-2xl transition-opacity duration-700 ${
          at("spotlights") ? "opacity-100" : "opacity-0"
        }`}
        style={{ transform: "rotate(12deg)", animation: at("spotlights") ? "spotSweep 6s ease-in-out infinite reverse" : undefined }}
      />
      <div
        className={`pointer-events-none absolute -top-10 left-1/2 z-10 h-[110%] w-96 -translate-x-1/2 bg-gradient-to-b from-amber-100/25 via-amber-100/8 to-transparent blur-3xl transition-opacity duration-1000 ${
          at("spotlights") ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Red velvet curtains — open outward */}
      <div
        className="absolute inset-y-0 left-0 z-30 w-1/2 origin-left transition-transform duration-[1100ms] ease-[cubic-bezier(0.65,0,0.35,1)]"
        style={{
          background:
            "repeating-linear-gradient(90deg, #6b0f1a 0px, #8a1220 28px, #5a0a14 56px), linear-gradient(180deg, #4a0810 0%, #7a0e1a 100%)",
          backgroundBlendMode: "multiply",
          boxShadow: "inset -30px 0 60px rgba(0,0,0,0.7)",
          transform: at("spotlights") ? "translateX(-100%)" : "translateX(0)",
        }}
      />
      <div
        className="absolute inset-y-0 right-0 z-30 w-1/2 origin-right transition-transform duration-[1100ms] ease-[cubic-bezier(0.65,0,0.35,1)]"
        style={{
          background:
            "repeating-linear-gradient(90deg, #6b0f1a 0px, #8a1220 28px, #5a0a14 56px), linear-gradient(180deg, #4a0810 0%, #7a0e1a 100%)",
          backgroundBlendMode: "multiply",
          boxShadow: "inset 30px 0 60px rgba(0,0,0,0.7)",
          transform: at("spotlights") ? "translateX(100%)" : "translateX(0)",
        }}
      />

      {/* Top valance — stays */}
      <div
        className="absolute inset-x-0 top-0 z-40 h-20"
        style={{
          background:
            "repeating-linear-gradient(90deg, #6b0f1a 0px, #8a1220 22px, #5a0a14 44px)",
          boxShadow: "0 12px 30px rgba(0,0,0,0.55)",
        }}
      />
      <div className="absolute inset-x-0 top-20 z-40 flex justify-around">
        {Array.from({ length: 14 }).map((_, i) => (
          <span
            key={i}
            className="-mt-1.5 block h-3 w-3 rounded-full bg-amber-200"
            style={{ animation: `bulbPulse 1.4s ease-in-out ${(i % 4) * 0.2}s infinite` }}
          />
        ))}
      </div>

      {/* Center stage content */}
      <div className="relative z-20 mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 py-24 text-center">
        {/* Poster (the image) */}
        <div
          className={`relative ${at("poster") ? "opacity-100" : "opacity-0"}`}
          style={{
            animation: at("poster") ? "posterRise 900ms cubic-bezier(0.2,0.8,0.2,1) both" : undefined,
          }}
        >
          <div className="absolute -inset-6 rounded-3xl bg-amber-400/25 blur-3xl" />
          <div className="relative rounded-2xl border-4 border-amber-300/60 bg-[#1a0f0a] p-2 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)]">
            <img
              src="/troupe.png"
              alt="La troupe Impro 2pro"
              className="block max-h-[52vh] w-auto rounded-xl"
              onError={(e) => {
                const el = e.currentTarget as HTMLImageElement;
                el.outerHTML = posterFallbackHTML;
              }}
            />
          </div>
          {/* Marquee around poster */}
          <PosterBulbs />
        </div>

        {/* Title */}
        <h1
          className={`mt-10 font-marquee text-6xl font-black leading-none text-amber-100 transition-all duration-700 md:text-8xl ${
            at("title") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{
            animation: at("title") ? "titleGlow 3s ease-in-out infinite" : undefined,
          }}
        >
          IMPRO<span className="text-red-400">2</span>PRO
        </h1>

        <div
          className={`mt-3 inline-flex items-center gap-3 text-amber-200/90 transition-all duration-700 ${
            at("title") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          <span className="h-px w-10 bg-amber-300/60" />
          <span className="font-display text-base uppercase tracking-[0.35em] md:text-xl">
            La troupe entre en scène
          </span>
          <span className="h-px w-10 bg-amber-300/60" />
        </div>

        <button
          onClick={enter}
          className={`mt-10 inline-flex items-center gap-2 rounded-full border-2 border-amber-300/70 bg-amber-300 px-7 py-3 text-sm font-black uppercase tracking-[0.25em] text-[#2a1a14] shadow-[0_0_30px_rgba(252,211,77,0.45)] transition hover:scale-105 hover:bg-amber-200 md:text-base ${
            at("cta") ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          style={{ transition: "opacity 700ms ease, transform 200ms ease" }}
        >
          ★ Entrer dans la salle ★
        </button>

        <button
          onClick={enter}
          className="mt-4 text-[10px] uppercase tracking-[0.3em] text-amber-100/60 hover:text-amber-100"
        >
          passer l'animation →
        </button>
      </div>

      {/* Subtle confetti when CTA shows */}
      {at("cta") && <Confetti />}
    </div>
  );
}

const posterFallbackHTML = `
<div style="display:grid;place-items:center;padding:60px;border-radius:12px;background:linear-gradient(180deg,#3a2418,#1a0f0a);color:#ecbe4a;min-width:420px">
  <div style="font-family:'Big Shoulders Display',Impact,sans-serif;font-weight:900;font-size:48px;letter-spacing:0.08em">LA TROUPE</div>
  <div style="margin-top:8px;font-family:'Playfair Display',serif;font-style:italic;color:#fbf1f3">déposez public/troupe.png pour afficher l'affiche</div>
</div>`;

function MarqueeBulbs() {
  const horiz = Array.from({ length: 32 });
  const vert = Array.from({ length: 20 });
  return (
    <>
      <div className="absolute inset-x-3 -top-1.5 flex justify-between">
        {horiz.map((_, i) => (
          <span
            key={`t${i}`}
            className="block h-2.5 w-2.5 rounded-full bg-amber-200"
            style={{ animation: `bulbPulse 1.4s ease-in-out ${(i % 4) * 0.25}s infinite` }}
          />
        ))}
      </div>
      <div className="absolute inset-x-3 -bottom-1.5 flex justify-between">
        {horiz.map((_, i) => (
          <span
            key={`b${i}`}
            className="block h-2.5 w-2.5 rounded-full bg-amber-200"
            style={{ animation: `bulbPulse 1.4s ease-in-out ${((i + 2) % 4) * 0.25}s infinite` }}
          />
        ))}
      </div>
      <div className="absolute inset-y-3 -left-1.5 flex flex-col justify-between">
        {vert.map((_, i) => (
          <span
            key={`l${i}`}
            className="block h-2.5 w-2.5 rounded-full bg-amber-200"
            style={{ animation: `bulbPulse 1.4s ease-in-out ${((i + 1) % 4) * 0.25}s infinite` }}
          />
        ))}
      </div>
      <div className="absolute inset-y-3 -right-1.5 flex flex-col justify-between">
        {vert.map((_, i) => (
          <span
            key={`r${i}`}
            className="block h-2.5 w-2.5 rounded-full bg-amber-200"
            style={{ animation: `bulbPulse 1.4s ease-in-out ${((i + 3) % 4) * 0.25}s infinite` }}
          />
        ))}
      </div>
    </>
  );
}

function PosterBulbs() {
  return (
    <>
      <div className="pointer-events-none absolute inset-x-4 -top-[5px] flex justify-between">
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className="block h-2 w-2 rounded-full bg-amber-200"
            style={{ animation: `bulbPulse 1.2s ease-in-out ${(i % 3) * 0.2}s infinite` }}
          />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-x-4 -bottom-[5px] flex justify-between">
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className="block h-2 w-2 rounded-full bg-amber-200"
            style={{ animation: `bulbPulse 1.2s ease-in-out ${((i + 1) % 3) * 0.2}s infinite` }}
          />
        ))}
      </div>
    </>
  );
}

function Confetti() {
  const pieces = Array.from({ length: 40 });
  const colors = ["#ecbe4a", "#a82a44", "#f4d889", "#e6a87a", "#fbf1f3"];
  return (
    <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
      {pieces.map((_, i) => {
        const left = Math.random() * 100;
        const duration = 4 + Math.random() * 4;
        const delay = Math.random() * 1.2;
        const size = 6 + Math.random() * 8;
        const color = colors[i % colors.length];
        return (
          <span
            key={i}
            className="absolute -top-4 block rounded-sm"
            style={{
              left: `${left}%`,
              width: size,
              height: size * 0.4,
              backgroundColor: color,
              animation: `confettiFall ${duration}s linear ${delay}s forwards`,
            }}
          />
        );
      })}
    </div>
  );
}
