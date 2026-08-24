"use client";

import { useEffect, useRef, useState } from "react";
import type { FocusEvent, FormEvent } from "react";
import Link from "next/link";
import { instagramUrl } from "@/content/site";
import {
  enquiryEmail,
  enquiryEndpoint,
  enquiryFieldErrors,
  enquiryHearAbout,
  enquiryMailto,
  enquiryMonogram,
  enquiryPage,
  enquiryServices,
} from "@/content/enquire";
import { asset } from "@/lib/asset";

/**
 * The enquiry — the one interactive island on /enquire, so it is the only part
 * that is a client component. The page around it (chrome, metadata) stays a
 * server component.
 *
 * WHY IT OWNS THE MASTHEAD. Success does not replace the form, it replaces the
 * PAGE: the first build left "Start a project — tell us a little about you"
 * standing above a thank-you, and the confirmation read as an afterthought
 * bolted to the bottom of a form that was no longer there. So the h1 belongs to
 * this component: while the form is up it is "Start a project"; once the
 * enquiry is away it is the thank-you, and the panel becomes a centred
 * compliments slip with the monogram as the sender's mark (enquire.css).
 *
 * VALIDATION IS OURS, NOT THE BROWSER'S. The constraints are still declared on
 * the inputs (required, type=email, type=url) — they are what `checkValidity`
 * reads and what assistive tech announces — but `noValidate` suppresses the
 * native bubbles, which appear one at a time, name no field and vanish on the
 * next click. Instead: a badly-formed value is called out the moment you leave
 * the field, an empty required field says nothing until you press Send (tabbing
 * past a question you have not answered yet is not a mistake), every message
 * that is up clears on the keystroke that fixes it, and a failed Send puts a
 * message under every field that needs one and moves focus to the first.
 * Wording: `enquiryFieldErrors` in content/enquire.ts.
 *
 * SUBMISSION. A valid form is sent to FormSubmit over fetch as JSON. On success
 * the form is swapped for the confirmation and focus moves to its heading —
 * never a silent success (DESIGN.md §7, SITEMAP §4.6). A failed send leaves the
 * form in place with an error banner and a mailto fallback, so an enquiry is
 * never lost to a network blip.
 *
 * The multi-select services collapse to one comma-separated field so the email
 * reads as a line rather than as repeated keys, and `_honey` is a honeypot: a
 * field a human never sees and a bot fills, which we treat as a silent success.
 */
type Status = "idle" | "sending" | "success" | "error";

export function EnquireSection() {
  const [status, setStatus] = useState<Status>("idle");
  /** The address the visitor typed, echoed back on the slip. "" for a bot. */
  const [replyTo, setReplyTo] = useState("");
  /** Live messages, keyed by input id. A field with no key here is clean. */
  const [errors, setErrors] = useState<Record<string, string>>({});
  const confirmationRef = useRef<HTMLHeadingElement>(null);

  type Control = HTMLInputElement | HTMLTextAreaElement;

  /** What this field should say, given whichever constraint it is failing. */
  function messageFor(el: Control): string {
    const copy = enquiryFieldErrors[el.id];
    if (!copy) return el.validationMessage;
    if (el.validity.valueMissing) return copy.missing;
    return copy.invalid ?? copy.missing;
  }

  function setMessage(id: string, message: string) {
    setErrors((prev) => {
      if ((prev[id] ?? "") === message) return prev;
      const next = { ...prev };
      if (message) next[id] = message;
      else delete next[id];
      return next;
    });
  }

  /**
   * Leaving a field. Only a value that IS something and cannot work is called
   * out here — an empty required field is left alone until Send.
   */
  function onFieldBlur(event: FocusEvent<Control>) {
    const el = event.currentTarget;
    if (!el.value.trim()) return setMessage(el.id, "");
    setMessage(el.id, el.checkValidity() ? "" : messageFor(el));
  }

  /** Typing in a field that is already flagged: clear the flag the moment it
      becomes valid, rather than making them press Send to find out. */
  function onFieldInput(event: FormEvent<Control>) {
    const el = event.currentTarget;
    if (!errors[el.id]) return;
    if (el.checkValidity()) setMessage(el.id, "");
  }

  // Move focus to the confirmation heading the moment it appears.
  useEffect(() => {
    if (status === "success") confirmationRef.current?.focus();
  }, [status]);

  /**
   * One field: its label, its control and whatever it is currently complaining
   * about. Every field on this form is the same three parts, and writing them
   * out ten times is how the ten drift apart — one missing `aria-describedby`,
   * one label that forgets its `for`.
   *
   * `(optional)` rather than `(required)`: seven of these are compulsory, so
   * the note above the form carries the rule and only the exceptions are
   * marked. The `required` attribute stays on the control itself — it is what
   * `checkValidity` reads and what a screen reader announces.
   */
  function renderField({
    id,
    name,
    label,
    type = "text",
    textarea = false,
    required = false,
    autoComplete,
    inputMode,
    placeholder,
  }: {
    id: string;
    name: string;
    label: string;
    type?: string;
    textarea?: boolean;
    required?: boolean;
    autoComplete?: string;
    inputMode?: "url";
    placeholder?: string;
  }) {
    const message = errors[id];
    const shared = {
      id,
      name,
      required,
      placeholder,
      autoComplete,
      onBlur: onFieldBlur,
      onInput: onFieldInput,
      "aria-invalid": message ? (true as const) : undefined,
      "aria-describedby": message ? `${id}-message` : undefined,
    };

    return (
      <div className="enq__field" key={id}>
        <label className="enq__label" htmlFor={id}>
          {label}
          {!required && <span className="enq__opt"> {enquiryPage.optionalLabel}</span>}
        </label>
        {textarea ? (
          <textarea className="enq__input enq__textarea" rows={5} {...shared} />
        ) : (
          <input className="enq__input" type={type} inputMode={inputMode} {...shared} />
        )}
        {message && (
          <p className="enq__message" id={`${id}-message`}>
            {message}
          </p>
        )}
      </div>
    );
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    // Our own pass over the same constraints: flag every field that needs it,
    // then hand focus to the first one rather than firing a native bubble.
    const controls = [...form.elements].filter(
      (el): el is HTMLInputElement | HTMLTextAreaElement =>
        (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) &&
        el.id in enquiryFieldErrors,
    );
    const found: Record<string, string> = {};
    for (const el of controls) if (!el.checkValidity()) found[el.id] = messageFor(el);
    setErrors(found);
    const firstBad = controls.find((el) => found[el.id]);
    if (firstBad) {
      firstBad.focus();
      return;
    }

    const data = new FormData(form);

    // Honeypot: filled only by bots. Pretend it worked, send nothing.
    if (data.get("_honey")) {
      setStatus("success");
      return;
    }

    const chosenServices = data.getAll("Services of interest").filter(Boolean);
    const payload: Record<string, string> = {};
    for (const [key, value] of data.entries()) {
      if (key === "Services of interest" || key === "_honey") continue;
      if (typeof value === "string") payload[key] = value;
    }
    payload["Services of interest"] = chosenServices.join(", ") || "—";

    // FormSubmit control fields — a readable subject and a tabular email.
    payload._subject = "New enquiry — MaeMüllen website";
    payload._template = "table";
    payload._captcha = "false";

    setReplyTo(typeof payload.email === "string" ? payload.email : "");
    setStatus("sending");
    try {
      const response = await fetch(enquiryEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`Enquiry relay returned ${response.status}`);
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <section className="enq__panel enq__panel--done" role="status">
        <div className="enq__done">
          <img
            className="enq__done-mark"
            src={asset(enquiryMonogram.src)}
            alt={enquiryMonogram.alt}
            width={56}
            height={56}
          />
          <p className="enq__done-eyebrow">
            <span>{enquiryPage.confirmation.eyebrow}</span>
          </p>
          <h1 className="enq__done-heading" tabIndex={-1} ref={confirmationRef}>
            {enquiryPage.confirmation.heading}
          </h1>
          <p className="enq__done-body">{enquiryPage.confirmation.body}</p>
          {replyTo && (
            <p className="enq__done-meta">
              <span className="enq__done-meta-key">
                {enquiryPage.confirmation.replyLabel}
              </span>
              <span className="enq__done-meta-value">{replyTo}</span>
            </p>
          )}
          <div className="enq__done-foot">
            {instagramUrl && (
              <a
                className="mm-cta-bracket enq__done-link"
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {enquiryPage.confirmation.instagramLabel}
              </a>
            )}
            <p className="enq__done-note">
              {enquiryPage.confirmation.note}{" "}
              <Link className="enq__note-link" href={enquiryMailto}>
                {enquiryEmail}
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <header className="enq__masthead">
        <h1 className="enq__title">{enquiryPage.title}</h1>
        <p className="enq__standfirst">{enquiryPage.standfirst}</p>
      </header>

      <div className="enq__panel">
        <img
          className="enq__mark"
          src={asset(enquiryMonogram.src)}
          alt={enquiryMonogram.alt}
          width={48}
          height={48}
        />
        <form className="enq__form" onSubmit={onSubmit} noValidate>
          {status === "error" && (
            <div className="enq__error" role="alert">
              <p className="enq__error-heading">{enquiryPage.error.heading}</p>
              <p className="enq__error-body">{enquiryPage.error.body}</p>
              <a className="mm-cta-bracket enq__error-link" href={enquiryMailto}>
                {enquiryPage.error.retryLabel}
              </a>
            </div>
          )}

          {/* Honeypot — visually and semantically hidden, off the tab order. */}
          <div className="enq__honey" aria-hidden="true">
            <label>
              Leave this field empty
              <input type="text" name="_honey" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          <p className="enq__required-note">{enquiryPage.requiredNote}</p>

          {/* Name — the one pair that stays side by side: two halves of a single
              answer, read as one line. Every other field gets its own row —
              Brand under Email under Location read as a list of separate
              questions, and a single column is measurably quicker to fill than
              a grid of unrelated pairs. */}
          <div className="enq__row enq__row--2">
            {renderField({
              id: "firstName",
              name: "First name",
              label: "First name",
              autoComplete: "given-name",
              required: true,
            })}
            {renderField({
              id: "lastName",
              name: "Last name",
              label: "Last name",
              autoComplete: "family-name",
              required: true,
            })}
          </div>

          {renderField({
            id: "brand",
            name: "Brand / company",
            label: "Brand / company name",
            autoComplete: "organization",
            required: true,
          })}

          {/* Named `email` so FormSubmit sets the reply-to to the enquirer. */}
          {renderField({
            id: "email",
            name: "email",
            label: "Email",
            type: "email",
            autoComplete: "email",
            required: true,
          })}

          {renderField({
            id: "social",
            name: "Social handle(s)",
            label: "Social media handle(s)",
            placeholder: "@",
            required: true,
          })}

          {renderField({
            id: "location",
            name: "Location",
            label: "Location",
            autoComplete: "address-level2",
            required: true,
          })}

          {renderField({
            id: "website",
            name: "Website",
            label: "Website",
            type: "url",
            inputMode: "url",
            placeholder: "https://",
            autoComplete: "url",
          })}

          {renderField({
            id: "brief",
            name: "Describe your brand",
            label: "Describe your brand",
            textarea: true,
            required: true,
          })}

          {/* Service(s) of interest — optional multi-select as checkboxes. */}
          <fieldset className="enq__field enq__checks">
            <legend className="enq__label enq__label--legend">
              Service(s) of interest <span className="enq__opt">{enquiryPage.optionalLabel}</span>
            </legend>
            <ul className="enq__check-list">
              {enquiryServices.map((service) => (
                <li key={service} className="enq__check">
                  <label className="enq__check-label">
                    <input
                      className="enq__checkbox"
                      type="checkbox"
                      name="Services of interest"
                      value={service}
                    />
                    <span>{service}</span>
                  </label>
                </li>
              ))}
            </ul>
          </fieldset>

          <div className="enq__field enq__field--select">
            <label className="enq__label" htmlFor="hear">
              Where did you hear about us?{" "}
              <span className="enq__opt">{enquiryPage.optionalLabel}</span>
            </label>
            <div className="enq__select-wrap">
              <select className="enq__input enq__select" id="hear" name="Heard about us" defaultValue="">
                <option value="" disabled>
                  Select one…
                </option>
                {enquiryHearAbout.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <span className="enq__select-chevron" aria-hidden="true" />
            </div>
          </div>

          <label className="enq__optin">
            <input
              className="enq__checkbox"
              type="checkbox"
              name="Newsletter opt-in"
              value="Yes"
            />
            <span>Sign up for news and updates</span>
          </label>

          <div className="enq__actions">
            <button className="enq__submit" type="submit" disabled={status === "sending"}>
              {status === "sending" ? enquiryPage.sendingLabel : enquiryPage.submitLabel}
            </button>
          </div>

          <p className="enq__note">
            Prefer email? Reach us any time at{" "}
            <Link className="enq__note-link" href={enquiryMailto}>
              maemullenagency@gmail.com
            </Link>
            .
          </p>
        </form>
      </div>
    </>
  );
}
