"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";

import { Field, SuccessPanel, TextAreaField } from "@/components/FormParts";
import { Button } from "@/components/ui/button";

/**
 * Membership request form. No backend is wired yet — submission is simulated
 * client-side. Connect to an email service / route handler to process requests.
 */
export default function MembershipForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    window.setTimeout(() => setStatus("sent"), 900);
  };

  if (status === "sent") {
    return (
      <SuccessPanel
        title="Demande envoyée"
        message="Bienvenue parmi nous ! Votre demande d'adhésion a bien été reçue. Nous reviendrons vers vous très rapidement."
      />
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Prénom" name="firstName" autoComplete="given-name" required />
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>
      <Field
        label="Téléphone"
        name="phone"
        type="tel"
        autoComplete="tel"
        placeholder="+33 6 00 00 00 00"
      />
      <TextAreaField
        label="Votre message"
        name="message"
        placeholder="Parlez-nous de votre passion Ferrari, de votre voiture éventuelle…"
      />
      <Button type="submit" size="lg" disabled={status === "sending"} className="w-full">
        {status === "sending" ? "Envoi en cours…" : "Envoyer ma demande d'adhésion"}
        <ArrowRight />
      </Button>
    </form>
  );
}
