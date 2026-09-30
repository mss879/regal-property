"use client";

import { useActionState, useRef } from "react";
import { useFormStatus } from "react-dom";
import { submitEnquiry, type EnquiryState } from "@/app/contact/actions";
import { gsap, useGSAP, REDUCED } from "@/lib/gsap";
import { Arrow } from "@/components/ui/Button";

type LotOption = { id: string; label: string; status: string };

const INTERESTS = ["Pre-booking a villa", "Arranging a site visit", "Floor plans & pricing", "Something else"];

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="group/btn inline-flex items-center gap-3 rounded-full bg-forest px-8 py-4 text-[0.95rem] font-semibold text-paper transition-colors hover:bg-leaf disabled:opacity-60"
    >
      {pending ? "Sending…" : "Send enquiry"}
      <Arrow />
    </button>
  );
}

function Field({
  label,
  name,
  error,
  children,
  hint,
}: {
  label: string;
  name: string;
  error?: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="group block" htmlFor={name}>
      <span className="flex items-baseline justify-between gap-4">
        <span className="eyebrow text-ink-2 group-focus-within:text-leaf">{label}</span>
        {hint && <span className="text-[0.72rem] text-ink-2/70">{hint}</span>}
      </span>
      {children}
      {error && (
        <span id={`${name}-error`} className="mt-2 block text-[0.8rem] text-sold" role="alert">
          {error}
        </span>
      )}
    </label>
  );
}

const input =
  "mt-2 block w-full border-0 border-b border-forest/20 bg-transparent px-0 py-3 text-[1.05rem] text-forest placeholder:text-ink-2/50 focus:border-leaf focus:ring-0 focus:outline-none transition-colors aria-[invalid=true]:border-sold";

export function ContactForm({ lots, initialLot }: { lots: LotOption[]; initialLot?: string }) {
  const [state, action] = useActionState<EnquiryState, FormData>(submitEnquiry, { status: "idle" });
  const root = useRef<HTMLDivElement>(null);
  const v = state.values ?? {};
  const e = state.errors ?? {};

  useGSAP(
    () => {
      if (state.status !== "success" || window.matchMedia(REDUCED).matches) return;
      gsap.from("[data-success] > *", { y: 30, autoAlpha: 0, stagger: 0.1, duration: 1, ease: "expo.out" });
    },
    { scope: root, dependencies: [state.status] },
  );

  if (state.status === "success") {
    return (
      <div ref={root}>
        <div data-success className="flex min-h-[520px] flex-col justify-center" role="status">
          <span className="flex size-16 items-center justify-center rounded-full bg-leaf text-paper">
            <svg viewBox="0 0 24 24" className="size-7"><path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
          <h2 className="mt-8 font-display text-title font-light tracking-[-0.02em] text-forest uppercase">
            Thank you{state.name ? `, ${state.name}` : ""}
          </h2>
          <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-ink-2">
            Your enquiry has been received. A member of the Regal Victoria Lakeside team will be in touch shortly.
          </p>
        </div>
      </div>
    );
  }

  const lotDefault = v.lot ?? (initialLot && lots.some((l) => l.id === initialLot) ? initialLot : "any");

  return (
    <div ref={root}>
      <form action={action} noValidate className="space-y-9">
        <div className="grid gap-9 sm:grid-cols-2">
          <Field label="Full name" name="name" error={e.name}>
            <input id="name" name="name" autoComplete="name" required defaultValue={v.name} className={input} placeholder="Your name" aria-invalid={!!e.name} aria-describedby={e.name ? "name-error" : undefined} />
          </Field>
          <Field label="Email" name="email" error={e.email}>
            <input id="email" name="email" type="email" autoComplete="email" required defaultValue={v.email} className={input} placeholder="you@example.com" aria-invalid={!!e.email} aria-describedby={e.email ? "email-error" : undefined} />
          </Field>
          <Field label="Phone" name="phone" error={e.phone} hint="Optional">
            <input id="phone" name="phone" type="tel" autoComplete="tel" defaultValue={v.phone} className={input} placeholder="+94 …" aria-invalid={!!e.phone} aria-describedby={e.phone ? "phone-error" : undefined} />
          </Field>
          <Field label="Villa of interest" name="lot" error={e.lot}>
            <select id="lot" name="lot" defaultValue={lotDefault} className={`${input} cursor-pointer`} aria-invalid={!!e.lot}>
              <option value="any">Any villa / not sure yet</option>
              {lots.map((l) => (
                <option key={l.id} value={l.id} disabled={l.status === "Sold"}>
                  {l.label} — {l.status}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <fieldset>
          <legend className="eyebrow text-ink-2">I&apos;m interested in</legend>
          <div className="mt-4 flex flex-wrap gap-2">
            {INTERESTS.map((i, n) => (
              <label key={i} className="cursor-pointer">
                <input type="radio" name="interest" value={i} defaultChecked={v.interest ? v.interest === i : n === 0} className="peer sr-only" />
                <span className="block rounded-full border border-forest/20 px-4 py-2 text-[0.85rem] text-forest transition-colors peer-checked:border-forest peer-checked:bg-forest peer-checked:text-paper peer-focus-visible:outline-2 peer-focus-visible:outline-leaf hover:border-forest/50">
                  {i}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <Field label="Message" name="message" error={e.message} hint="Optional">
          <textarea id="message" name="message" rows={4} defaultValue={v.message} className={`${input} resize-none`} placeholder="Tell us a little about what you're looking for…" aria-invalid={!!e.message} />
        </Field>

        {/* Honeypot */}
        <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>
            Company <input name="company" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xs text-[0.75rem] leading-relaxed text-ink-2">
            We&apos;ll only use your details to respond to this enquiry.
          </p>
          <Submit />
        </div>
      </form>
    </div>
  );
}
