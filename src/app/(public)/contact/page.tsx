"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Replace with your actual API call e.g. POST /api/contact
    await new Promise((r) => setTimeout(r, 1000));
    setSent(true);
    setLoading(false);
  };

  const inputClass =
    "w-full rounded-md border border-border bg-surface px-4 py-3 text-[14px] text-primary placeholder:text-muted focus:border-[#0A0A0A] focus:outline-none transition-colors";

  return (
    <main className="relative min-h-screen bg-background font-sans">

      {/* Grain */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "180px 180px",
        }}
      />


      {/* HERO ROW */}
      <section className="relative z-10 mx-auto max-w-6xl px-8 pt-16 pb-12 sm:px-12">
        <p className="mb-5 text-[11px] uppercase tracking-[0.35em] text-muted">
          Contact
        </p>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <h1
            className="max-w-lg text-[clamp(2.4rem,5vw,4.2rem)] font-semibold leading-[1.08] text-primary"
            style={{ letterSpacing: "-0.03em" }}
          >
            We&apos;re here.
            <br />
            <em className="font-normal not-italic text-[#6A6860]">Say something.</em>
          </h1>
          <p className="max-w-xs text-[14px] leading-[1.85] text-secondary lg:text-right">
            Questions, feedback, or partnership — we read every message and
            reply within one business day.
          </p>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="mx-auto max-w-6xl px-8 sm:px-12">
        <div className="h-px w-full bg-[#D6D4CE]" />
      </div>

      {/* MAIN CONTENT */}
      <section className="relative z-10 mx-auto max-w-6xl px-8 py-16 sm:px-12">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.8fr]">

          {/* Left — info */}
          <div className="space-y-6">
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted">
              Get in touch
            </span>

            {[
              {
                label: "Email",
                value: "hello@mdpawvita.com",
                sub: "We reply within 24 hours",
              },
              {
                label: "Support",
                value: "support@mdpawvita.com",
                sub: "Order issues, returns, tracking",
              },
              {
                label: "Location",
                value: "Karachi, Pakistan",
                sub: "Head office",
              },
              {
                label: "Hours",
                value: "Mon – Sat, 9am – 7pm",
                sub: "PKT (UTC+5)",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-border bg-surface p-6"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted">
                  {item.label}
                </p>
                <p className="mt-2 text-[14px] font-medium text-primary">
                  {item.value}
                </p>
                <p className="mt-1 text-[12px] text-muted">{item.sub}</p>
              </div>
            ))}
          </div>

          {/* Right — form */}
          <div className="rounded-[20px] border border-border bg-surface p-8 sm:p-10">
            {sent ? (
              <div className="flex h-full flex-col items-center justify-center py-16 text-center">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-accent">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10l4.5 4.5L16 6" stroke="#F5F4F0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="text-[18px] font-medium text-primary" style={{ letterSpacing: "-0.01em" }}>
                  Message sent.
                </p>
                <p className="mt-2 text-[13px] text-secondary">
                  We&apos;ll get back to you within one business day.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                  className="mt-8 rounded-full border border-[#C8C6C0] px-6 py-2.5 text-[13px] text-secondary transition-colors hover:border-[#0A0A0A] hover:text-primary"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
                    Full name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ahmad Khan"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
                    Subject
                  </label>
                  <select
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className={inputClass + " cursor-pointer appearance-none"}
                  >
                    <option value="" disabled>Select a topic</option>
                    <option value="order">Order issue</option>
                    <option value="product">Product question</option>
                    <option value="return">Return / refund</option>
                    <option value="partnership">Partnership</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Tell us what's on your mind..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className={inputClass + " resize-none"}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 w-full rounded-full bg-accent py-3.5 text-[13px] font-medium text-[#F5F4F0] transition-colors hover:bg-[#2A2A2A] disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}