import Image from "next/image";
import type { ReactNode } from "react";

import Reveal from "@/components/Reveal";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  /** Optional background image path. */
  image?: string;
  className?: string;
};

/**
 * Inner-page hero band. Includes the top padding required to clear the fixed
 * header, so pages can start directly with <PageHeader /> at altitude.
 */
export default function PageHeader({
  eyebrow,
  title,
  description,
  image,
  className,
}: PageHeaderProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-border",
        image ? "pb-20 pt-44" : "bg-carbon-texture pb-16 pt-40",
        className,
      )}
    >
      {image && (
        <>
          <Image
            src={image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/70 to-background" />
        </>
      )}
      <div className="absolute inset-0 bg-rosso-glow opacity-60" />

      <div className="container relative z-10">
        <Reveal className="max-w-3xl">
          {eyebrow && (
            <span className={cn("eyebrow mb-5", image && "text-white/70")}>
              {eyebrow}
            </span>
          )}
          <h1
            className={cn(
              "display-title text-5xl sm:text-6xl lg:text-7xl",
              image ? "text-white" : "text-foreground",
            )}
          >
            {title}
          </h1>
          {description && (
            <p
              className={cn(
                "mt-6 max-w-2xl text-lg leading-relaxed",
                image ? "text-white/80" : "text-muted-foreground",
              )}
            >
              {description}
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
