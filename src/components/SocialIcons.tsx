import { Facebook, Instagram, Youtube } from "lucide-react";
import type { ComponentType } from "react";

import { socialLinks } from "@/lib/site";
import { cn } from "@/lib/utils";

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
};

type SocialIconsProps = {
  className?: string;
  /**
   * "auto" (défaut) : suit le thème via les tokens — à utiliser sur les
   * sections qui basculent clair/sombre.
   * "onDark" : icônes claires, pour un contexte toujours sombre (footer).
   */
  tone?: "auto" | "onDark";
};

export default function SocialIcons({
  className,
  tone = "auto",
}: SocialIconsProps) {
  const toneClasses =
    tone === "onDark"
      ? "border-white/15 text-white/70"
      : "border-border text-muted-foreground";

  return (
    <ul className={cn("flex items-center gap-3", className)}>
      {socialLinks.map((social) => {
        const Icon = iconMap[social.icon];
        return (
          <li key={social.label}>
            <a
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 hover:border-rosso hover:bg-rosso hover:text-white hover:-translate-y-0.5",
                toneClasses,
              )}
            >
              <Icon className="h-4 w-4" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
