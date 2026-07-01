import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import SocialIcons from "@/components/SocialIcons";
import { navItems, siteConfig } from "@/lib/site";

export default function Footer() {
  const year = 2026;

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-ink">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-rosso/60 to-transparent" />

      <div className="container grid gap-12 py-16 md:grid-cols-12 md:py-20">
        {/* Brand */}
        <div className="md:col-span-5">
          <Image
            src={siteConfig.logo}
            alt={siteConfig.name}
            width={2560}
            height={567}
            className="h-11 w-auto"
          />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {siteConfig.description}
          </p>
          <SocialIcons className="mt-8" tone="onDark" />
        </div>

        {/* Navigation */}
        <div className="md:col-span-3">
          <h3 className="eyebrow mb-6">Navigation</h3>
          <ul className="space-y-3">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-white/70 transition-colors hover:text-rosso"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="md:col-span-4">
          <h3 className="eyebrow mb-6">Contact</h3>
          <ul className="space-y-4 text-sm text-white/70">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-rosso" />
              <span>{siteConfig.city}</span>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-rosso" />
              <a
                href={`mailto:${siteConfig.email}`}
                className="transition-colors hover:text-white"
              >
                {siteConfig.email}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-rosso" />
              <a
                href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                className="transition-colors hover:text-white"
              >
                {siteConfig.phone}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container flex flex-col items-center justify-between gap-4 py-6 text-xs text-white/45 sm:flex-row">
          <p>
            © {year} {siteConfig.name}. Tous droits réservés.
          </p>
          <p className="text-center sm:text-right">
            Club officiel Ferrari — Ferrari, le Cheval Cabré et les marques
            associées sont la propriété de Ferrari S.p.A.
          </p>
        </div>
      </div>
    </footer>
  );
}
