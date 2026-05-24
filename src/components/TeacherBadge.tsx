"use client";

import type { Teacher } from "@/lib/types";

export function TeacherBadge({
  teacher,
  size = "sm",
}: {
  teacher?: Teacher;
  size?: "sm" | "md" | "lg";
}) {
  if (!teacher) {
    return (
      <span className="chip">
        <span className="grid h-5 w-5 place-items-center rounded-full bg-ivory-100/10 text-[10px]">
          ?
        </span>
        sans prof
      </span>
    );
  }
  const dim =
    size === "lg" ? "h-10 w-10 text-base" : size === "md" ? "h-8 w-8 text-sm" : "h-6 w-6 text-[11px]";
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={`grid place-items-center rounded-full font-marquee font-black text-ink-900 ${dim}`}
        style={{ backgroundColor: teacher.color, boxShadow: `0 0 14px ${teacher.color}55` }}
      >
        {teacher.name.charAt(0)}
      </span>
      <span className="text-sm font-medium text-ivory-100">{teacher.name}</span>
    </span>
  );
}
