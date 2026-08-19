import { clsx } from "clsx";
import type { ReactNode } from "react";

/**
 * DESIGN.md > Layout: icerik 1280px'te ortalanir, mobilde 16px / masaustunde
 * 40px kenar boslugu alir. Tasarimdaki her bolum bu sarmalayiciyi kullaniyor.
 */
export function Container({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "header" | "footer" | "nav";
}) {
  return (
    <Tag
      className={clsx(
        "max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
