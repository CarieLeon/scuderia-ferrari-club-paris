"use client";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";

export default function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/") return children;
  return <SmoothScroll><Header /><main>{children}</main><Footer /></SmoothScroll>;
}
