"use client";

import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "lenis/react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { navItems, siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const lenis = useLenis();
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Freeze smooth scroll while the mobile menu is open.
  useEffect(() => {
    if (!lenis) return;
    if (open) lenis.stop();
    else lenis.start();
  }, [open, lenis]);

  // Focus management for the mobile menu: focus the first link on open, trap
  // Tab within the overlay, Escape closes, and focus returns to the toggle.
  useEffect(() => {
    if (!open) return;
    const focusables = menuRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])',
    );
    const t = window.setTimeout(() => focusables?.[0]?.focus(), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key === "Tab" && focusables && focusables.length) {
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      toggleRef.current?.focus?.();
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled || open
          ? "border-b border-border bg-background/85 backdrop-blur-xl"
          : "border-b border-transparent bg-gradient-to-b from-black/60 to-transparent",
      )}
    >
      <div className="container flex items-center justify-between">
        <Link
          href="/"
          aria-label={siteConfig.name}
          className={cn(
            "relative z-50 flex items-center transition-all duration-500",
            scrolled ? "py-3" : "py-5",
          )}
        >
          <Image
            src={siteConfig.logo}
            alt={siteConfig.name}
            width={2560}
            height={567}
            priority
            className={cn(
              "w-auto transition-all duration-500",
              scrolled ? "h-9" : "h-10 md:h-11",
            )}
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative px-4 py-2 text-sm font-medium uppercase tracking-wide transition-colors",
                isActive(item.href)
                  ? scrolled
                    ? "text-foreground"
                    : "text-white"
                  : scrolled
                    ? "text-foreground/60 hover:text-foreground"
                    : "text-white/65 hover:text-white",
              )}
            >
              {item.label}
              <span
                className={cn(
                  "absolute inset-x-4 -bottom-0.5 h-px origin-left bg-rosso transition-transform duration-300",
                  isActive(item.href)
                    ? "scale-x-100"
                    : "scale-x-0 group-hover:scale-x-100",
                )}
              />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle
            className={cn(
              "relative z-50",
              scrolled || open ? "text-foreground" : "text-white",
            )}
          />

          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/adhesion">Adhérer</Link>
          </Button>

          <button
            ref={toggleRef}
            type="button"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "relative z-50 flex h-10 w-10 items-center justify-center transition-colors lg:hidden",
              scrolled || open ? "text-foreground" : "text-white",
            )}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-background/98 backdrop-blur-xl lg:hidden"
          >
            <nav className="container flex h-full flex-col justify-center gap-2 pb-16">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.06, duration: 0.4 }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "block py-3 font-display text-4xl uppercase tracking-tight transition-colors",
                      isActive(item.href)
                        ? "text-rosso"
                        : "text-foreground hover:text-rosso",
                    )}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="mt-8"
              >
                <Button asChild size="lg" className="w-full">
                  <Link href="/adhesion">Devenir membre</Link>
                </Button>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
