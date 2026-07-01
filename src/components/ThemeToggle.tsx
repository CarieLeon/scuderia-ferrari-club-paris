"use client";

import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";

/**
 * Bascule clair ↔ sombre. La couleur de l'icône est héritée (currentColor),
 * donc le parent (Header) peut adapter la teinte selon l'état de scroll.
 */
export default function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Activer le mode clair" : "Activer le mode sombre"}
      aria-pressed={!isDark}
      title={isDark ? "Mode clair" : "Mode sombre"}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:text-rosso focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      <Sun
        className={cn(
          "h-5 w-5 transition-all duration-300",
          isDark ? "scale-100 rotate-0 opacity-100" : "absolute scale-0 -rotate-90 opacity-0",
        )}
        aria-hidden="true"
      />
      <Moon
        className={cn(
          "h-5 w-5 transition-all duration-300",
          isDark ? "absolute scale-0 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100",
        )}
        aria-hidden="true"
      />
    </button>
  );
}
