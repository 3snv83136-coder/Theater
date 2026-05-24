"use client";

import type { Teacher } from "@/lib/types";

export function TeacherBadge({ teacher, size = "sm" }: { teacher?: Teacher; size?: "sm" | "md" }) {
  if (!teacher) return <span className="chip">Sans prof</span>;
  const dim = size === "md" ? "h-8 w-8 text-sm" : "h-6 w-6 text-[10px]";
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={`grid place-items-center rounded-full font-bold text-stage-950 ${dim}`}
        style={{ backgroundColor: teacher.color }}
      >
        {teacher.name.charAt(0)}
      </span>
      <span className="text-sm text-stage-100">{teacher.name}</span>
    </span>
  );
}
