"use client";

import { CheckCircle2 } from "lucide-react";
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export const labelClass =
  "mb-2 block text-xs font-semibold uppercase tracking-widest text-white/55";

export const controlClass =
  "w-full rounded-md border border-white/15 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-all duration-300 focus:border-rosso focus:bg-white/[0.05] focus:ring-1 focus:ring-rosso/60";

export function Field({
  label,
  name,
  required,
  className,
  ...props
}: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={className}>
      <label htmlFor={name} className={labelClass}>
        {label}
        {required && <span className="ml-1 text-rosso">*</span>}
      </label>
      <input id={name} name={name} required={required} className={controlClass} {...props} />
    </div>
  );
}

export function TextAreaField({
  label,
  name,
  required,
  className,
  ...props
}: { label: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className={className}>
      <label htmlFor={name} className={labelClass}>
        {label}
        {required && <span className="ml-1 text-rosso">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        required={required}
        className={cn(controlClass, "min-h-[140px] resize-y")}
        {...props}
      />
    </div>
  );
}

export function SuccessPanel({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-rosso/30 bg-rosso/5 px-8 py-14 text-center">
      <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-rosso/15 text-rosso">
        <CheckCircle2 className="h-7 w-7" />
      </span>
      <h3 className="font-display text-2xl uppercase tracking-tight text-white">
        {title}
      </h3>
      <p className="mt-3 max-w-sm text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
