"use client";

import Link from "next/link";
import { IconArrowRight } from "./Icons";

export type Tint =
  | "rose"
  | "gold"
  | "emerald"
  | "sky"
  | "violet"
  | "orange"
  | "coral"
  | "mint";

const TINT_COLORS: Record<Tint, string> = {
  rose: "#f472b6",
  gold: "#ecbe4a",
  emerald: "#34d399",
  sky: "#38bdf8",
  violet: "#a78bfa",
  orange: "#fb923c",
  coral: "#fb7185",
  mint: "#5eead4",
};

type Props = {
  children: React.ReactNode;
  eyebrow?: string;
  title?: string;
  actionHref?: string;
  actionLabel?: string;
  className?: string;
  tint?: Tint;
  contained?: boolean;
};

export function Section({
  children,
  eyebrow,
  title,
  actionHref,
  actionLabel,
  className = "",
  tint,
  contained = true,
}: Props) {
  const style = tint ? ({ ["--tint" as any]: TINT_COLORS[tint] } as React.CSSProperties) : undefined;
  const inner = contained ? (
    <div className={tint ? "tinted" : "card"} style={style}>
      {children}
    </div>
  ) : (
    children
  );

  return (
    <section className={`min-w-0 ${className}`} style={!contained ? style : undefined}>
      {(eyebrow || title || actionHref) && (
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2 sm:mb-4">
          <div className="min-w-0">
            {eyebrow && (
              <div
                className="text-[10px] font-bold uppercase tracking-[0.3em] truncate"
                style={tint ? { color: TINT_COLORS[tint] } : undefined}
              >
                {!tint ? <span className="eyebrow">{eyebrow}</span> : eyebrow}
              </div>
            )}
            {title && (
              <h2 className="truncate font-display text-xl font-bold text-ivory-50 sm:text-2xl">
                {title}
              </h2>
            )}
          </div>
          {actionHref && (
            <Link
              href={actionHref}
              className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-gold-300 transition hover:text-gold-200"
            >
              {actionLabel ?? "Voir tout"} <IconArrowRight size={14} />
            </Link>
          )}
        </div>
      )}
      {inner}
    </section>
  );
}
