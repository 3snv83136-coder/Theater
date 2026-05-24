"use client";

import Link from "next/link";
import { IconArrowRight } from "./Icons";

type Props = {
  children: React.ReactNode;
  eyebrow?: string;
  title?: string;
  actionHref?: string;
  actionLabel?: string;
  className?: string;
  contained?: boolean;
};

export function Section({
  children,
  eyebrow,
  title,
  actionHref,
  actionLabel,
  className = "",
  contained = true,
}: Props) {
  const inner = contained ? (
    <div className="rounded-2xl border border-ivory-100/10 bg-ink-900/40 p-4 backdrop-blur sm:p-6">
      {children}
    </div>
  ) : (
    children
  );

  return (
    <section className={`min-w-0 ${className}`}>
      {(eyebrow || title || actionHref) && (
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2 sm:mb-4">
          <div className="min-w-0">
            {eyebrow && <div className="eyebrow truncate">{eyebrow}</div>}
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
