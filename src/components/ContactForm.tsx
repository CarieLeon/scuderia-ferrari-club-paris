"use client";

import { Send } from "lucide-react";
import { useState } from "react";

import { Field, SuccessPanel, TextAreaField } from "@/components/FormParts";
import { Button } from "@/components/ui/button";

/**
 * Contact form. No backend is wired yet — submission is simulated client-side
 * and shows a confirmation. Connect to an email service / route handler to send.
 */
export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    window.setTimeout(() => setStatus("sent"), 900);
  };

  if (status === "sent") {
    return (
      <SuccessPanel
        title="Message envoyé"
        message="Merci pour votre message. L'équipe du club vous répondra dans les plus brefs délais."
      />
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nom complet" name="name" autoComplete="name" required />
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>
      <Field label="Sujet" name="subject" />
      <TextAreaField
        label="Votre message"
        name="message"
        placeholder="Comment pouvons-nous vous aider ?"
        required
      />
      <Button type="submit" size="lg" disabled={status === "sending"} className="w-full sm:w-auto">
        {status === "sending" ? "Envoi en cours…" : "Envoyer le message"}
        <Send />
      </Button>
    </form>
  );
}
