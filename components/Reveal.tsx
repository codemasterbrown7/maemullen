"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/**
 * Scroll reveal (DESIGN.md §9.2): opacity 0→1, 16px rise, fires once.
 * Timing, easing and stagger all come from tokens via the .reveal styles;
 * `index` staggers siblings by --stagger-step. The hidden initial state is
 * gated behind @media (scripting: enabled), so content is never invisible
 * when JS fails, and reduced motion renders it instantly.
 */
export function Reveal({
  children,
  index = 0,
  className,
}: {
  children: ReactNode;
  index?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          el.classList.add("is-revealed");
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className ? `reveal ${className}` : "reveal"}
      style={{ "--reveal-index": index } as CSSProperties}
    >
      {children}
    </div>
  );
}
