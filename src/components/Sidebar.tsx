"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Accueil", icon: "🎭" },
  { href: "/cours", label: "Cours", icon: "📚" },
  { href: "/cours/nouveau", label: "Créer un cours", icon: "✨" },
  { href: "/generateurs", label: "Générateurs", icon: "🎲" },
  { href: "/agenda", label: "Agenda", icon: "📅" },
  { href: "/inscription", label: "Inscriptions", icon: "📝" },
  { href: "/contenu", label: "Contenu", icon: "📰" },
  { href: "/spectacles", label: "Spectacles", icon: "🎟️" },
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/site", label: "Site public", icon: "🌐" },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-white/10 bg-stage-950/60 px-4 py-6 backdrop-blur lg:flex lg:flex-col">
      <Link href="/" className="mb-8 flex items-center gap-3 px-2">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-scene-500 to-velvet-700 text-xl shadow-lg">
          🎭
        </div>
        <div>
          <div className="font-display text-lg font-bold leading-tight">Impro 2pro</div>
          <div className="text-xs text-stage-400">Compagnie de théâtre</div>
        </div>
      </Link>
      <nav className="flex flex-1 flex-col gap-1">
        {links.map((l) => {
          const active = pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href));
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                active
                  ? "bg-scene-500/15 text-scene-200 ring-1 ring-scene-500/40"
                  : "text-stage-300 hover:bg-white/5 hover:text-stage-50"
              }`}
            >
              <span className="text-base">{l.icon}</span>
              <span>{l.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-stage-300">
        <div className="font-semibold text-stage-100">La troupe</div>
        <div className="mt-1 leading-relaxed">
          Florence · Maïty · Julien · Carole · Isabelle · Gaëlle · Corentin · Jb
        </div>
      </div>
    </aside>
  );
}
