"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { instagramUrl } from "@/content/site";
import {
  enquiryEndpoint,
  enquiryHearAbout,
  enquiryMailto,
  enquiryPage,
  enquiryServices,
} from "@/content/enquire";

/**
 * The enquiry form — the one interactive island on /enquire, so it is the only
 * part that is a client component. The page around it (masthead, chrome,
 * metadata) stays a server component.
 *
 * SUBMISSION. Browser-native validation gates the submit (required, type=email,
 * type=url); a valid form is sent to FormSubmit over fetch as JSON. On success
 * the form is swapped for a confirmation and focus moves to its heading — never
 * a silent success (DESIGN.md §7, SITEMAP §4.6). A failed send leaves the form
 * in place with an error banner and a mailto fallback, so an enquiry is never
 * lost to a network blip.
 *
 * The multi-select services collapse to one comma-separated field so the email
 * reads as a line rather than as repeated keys, and `_honey` is a honeypot: a
 * field a human never sees and a bot fills, which we treat as a silent success.
 */
type Status = "idle" | "sending" | "success" | "error";

export function EnquireForm() {
  const [status, setStatus] = useState<Status>("idle");
  const confirmationRef = useRef<HTMLHeadingElement>(null);

  // Move focus to the confirmation heading the moment it appears.
  useEffect(() => {
    if (status === "success") confirmationRef.current?.focus();
  }, [status]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    // Let the browser surface required / email / url errors first.
    if (!form.reportValidity()) return;

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
      <div className="enq__done" role="status">
        <h2 className="enq__done-heading" tabIndex={-1} ref={confirmationRef}>
          {enquiryPage.confirmation.heading}
        </h2>
        <p className="enq__done-body">{enquiryPage.confirmation.body}</p>
        {instagramUrl && (
          <a
            className="mm-cta-bracket enq__done-link"
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Follow on Instagram
          </a>
        )}
      </div>
    );
  }

  return (
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

      {/* Name — two fields on one row (matches the reference forms, deck p20). */}
      <fieldset className="enq__row enq__row--2">
        <legend className="enq__legend">Your name</legend>
        <div className="enq__field">
          <label className="enq__label" htmlFor="firstName">
            First name <span className="enq__req">(required)</span>
          </label>
          <input
            className="enq__input"
            id="firstName"
            name="First name"
            type="text"
            autoComplete="given-name"
            required
          />
        </div>
        <div className="enq__field">
          <label className="enq__label" htmlFor="lastName">
            Last name <span className="enq__req">(required)</span>
          </label>
          <input
            className="enq__input"
            id="lastName"
            name="Last name"
            type="text"
            autoComplete="family-name"
            required
          />
        </div>
      </fieldset>

      <div className="enq__row enq__row--2">
        <div className="enq__field">
          <label className="enq__label" htmlFor="brand">
            Brand / company name <span className="enq__req">(required)</span>
          </label>
          <input
            className="enq__input"
            id="brand"
            name="Brand / company"
            type="text"
            autoComplete="organization"
            required
          />
        </div>
        <div className="enq__field">
          <label className="enq__label" htmlFor="email">
            Email <span className="enq__req">(required)</span>
          </label>
          {/* Named `email` so FormSubmit sets the reply-to to the enquirer. */}
          <input
            className="enq__input"
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </div>
      </div>

      <div className="enq__row enq__row--2">
        <div className="enq__field">
          <label className="enq__label" htmlFor="social">
            Social media handle(s) <span className="enq__req">(required)</span>
          </label>
          <input
            className="enq__input"
            id="social"
            name="Social handle(s)"
            type="text"
            placeholder="@"
            required
          />
        </div>
        <div className="enq__field">
          <label className="enq__label" htmlFor="location">
            Location <span className="enq__req">(required)</span>
          </label>
          <input
            className="enq__input"
            id="location"
            name="Location"
            type="text"
            autoComplete="address-level2"
            required
          />
        </div>
      </div>

      <div className="enq__field">
        <label className="enq__label" htmlFor="website">
          Website
        </label>
        <input
          className="enq__input"
          id="website"
          name="Website"
          type="url"
          inputMode="url"
          placeholder="https://"
          autoComplete="url"
        />
      </div>

      <div className="enq__field">
        <label className="enq__label" htmlFor="brief">
          Describe your brand <span className="enq__req">(required)</span>
        </label>
        <textarea
          className="enq__input enq__textarea"
          id="brief"
          name="Describe your brand"
          rows={5}
          required
        />
      </div>

      {/* Service(s) of interest — optional multi-select as checkboxes. */}
      <fieldset className="enq__field enq__checks">
        <legend className="enq__label enq__label--legend">Service(s) of interest</legend>
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
          Where did you hear about us?
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
  );
}
