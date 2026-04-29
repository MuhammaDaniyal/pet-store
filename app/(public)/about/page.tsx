import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="relative min-h-screen bg-[#F5F4F0] font-sans">

      {/* Grain */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "180px 180px",
        }}
      />

      {/* NAV */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-8 py-6 sm:px-12">
        <Link href="/" className="text-[11px] font-bold tracking-[0.28em] text-[#0A0A0A]">
          PETSTORE
        </Link>
        <nav className="flex items-center gap-6 text-[12px] text-[#4A4945]">
          <Link href="/about" className="text-[#0A0A0A] font-medium">About</Link>
          <Link href="/contact" className="transition-colors hover:text-[#0A0A0A]">Contact</Link>
          <Link href="/shop" className="transition-colors hover:text-[#0A0A0A]">Shop</Link>
          <Link
            href="/sign-in"
            className="rounded-full border border-[#C8C6C0] px-5 py-2 text-[13px] transition-colors hover:border-[#0A0A0A] hover:text-[#0A0A0A]"
          >
            Sign in
          </Link>
        </nav>
      </header>

      {/* HERO ROW */}
      <section className="relative z-10 mx-auto max-w-6xl px-8 pt-16 pb-12 sm:px-12">
        <p className="mb-5 text-[11px] uppercase tracking-[0.35em] text-[#8A8880]">
          About us
        </p>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <h1
            className="max-w-xl text-[clamp(2.4rem,5vw,4.2rem)] font-semibold leading-[1.08] text-[#0A0A0A]"
            style={{ letterSpacing: "-0.03em" }}
          >
            Built for people
            <br />
            who love their pets{" "}
            <em className="font-normal not-italic text-[#6A6860]">deeply.</em>
          </h1>
          <p className="max-w-sm text-[14px] leading-[1.85] text-[#4A4945] lg:text-right">
            PetStore started from a simple frustration — finding quality
            pet products online was a mess. So we fixed it.
          </p>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="mx-auto max-w-6xl px-8 sm:px-12">
        <div className="h-px w-full bg-[#D6D4CE]" />
      </div>

      {/* STORY */}
      <section className="relative z-10 mx-auto max-w-6xl px-8 py-16 sm:px-12">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.6fr]">

          {/* Left — sticky label */}
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#8A8880]">
              Our story
            </span>
            <div className="mt-8 rounded-[20px] border border-[#D6D4CE] bg-[#EDECE8] p-7">
              <p className="text-[2rem] font-semibold leading-tight text-[#0A0A0A]" style={{ letterSpacing: "-0.02em" }}>
                2024
              </p>
              <p className="mt-2 text-[12px] uppercase tracking-[0.2em] text-[#8A8880]">
                Founded
              </p>
              <div className="my-5 h-px bg-[#D6D4CE]" />
              <p className="text-[2rem] font-semibold leading-tight text-[#0A0A0A]" style={{ letterSpacing: "-0.02em" }}>
                600+
              </p>
              <p className="mt-2 text-[12px] uppercase tracking-[0.2em] text-[#8A8880]">
                Products
              </p>
              <div className="my-5 h-px bg-[#D6D4CE]" />
              <p className="text-[2rem] font-semibold leading-tight text-[#0A0A0A]" style={{ letterSpacing: "-0.02em" }}>
                5
              </p>
              <p className="mt-2 text-[12px] uppercase tracking-[0.2em] text-[#8A8880]">
                Animal categories
              </p>
            </div>
          </div>

          {/* Right — text body */}
          <div className="space-y-6 text-[15px] leading-[1.85] text-[#4A4945]">
            <p>
              PetStore was founded by a group of pet owners who got tired of
              inconsistent quality, slow delivery, and stores that treated animals
              like an afterthought. We wanted something better — a single place
              with products we'd actually trust for our own companions.
            </p>
            <p>
              We carry over 600 products across dogs, cats, birds, fish, and
              reptiles. Every item is selected with care. If we wouldn't give it
              to our own pets, it doesn't make the catalogue.
            </p>
            <p>
              Delivery is fast and tracked. Your account keeps a full history of
              every order. And if something goes wrong, our support team is real
              people who actually care.
            </p>

            {/* Values */}
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {[
                { label: "Quality first", body: "We vet every supplier and every SKU. No filler, no compromise." },
                { label: "Fast delivery", body: "Order before midnight, receive it by morning. Always tracked." },
                { label: "Real support", body: "Humans on the other end. No bots, no ticket queues." },
                { label: "Transparency", body: "Honest pricing. Clear ingredients. Nothing hidden." },
              ].map((v) => (
                <div key={v.label} className="rounded-[16px] border border-[#D6D4CE] bg-[#EDECE8] p-6">
                  <p className="text-[13px] font-semibold text-[#0A0A0A]">{v.label}</p>
                  <p className="mt-2 text-[13px] leading-[1.7] text-[#4A4945]">{v.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="relative z-10 mx-auto max-w-6xl px-8 pb-24 sm:px-12">
        <div className="flex flex-col items-center justify-between gap-6 rounded-[20px] bg-[#0A0A0A] px-10 py-12 text-center sm:flex-row sm:text-left">
          <div>
            <p className="text-[18px] font-medium text-[#F5F4F0]" style={{ letterSpacing: "-0.01em" }}>
              Ready to find the perfect products?
            </p>
            <p className="mt-1 text-[13px] text-[#8A8880]">
              Join thousands of pet owners who trust PetStore.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/shop"
              className="rounded-full border border-[#3A3A3A] px-6 py-3 text-[13px] font-medium text-[#8A8880] transition-colors hover:border-[#F5F4F0] hover:text-[#F5F4F0]"
            >
              Browse shop
            </Link>
            <Link
              href="/sign-up"
              className="rounded-full bg-[#F5F4F0] px-6 py-3 text-[13px] font-medium text-[#0A0A0A] transition-colors hover:bg-[#EDECE8]"
            >
              Create account
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 mx-auto flex max-w-6xl items-center justify-between border-t border-[#D6D4CE] px-8 py-6 sm:px-12">
        <span className="text-[11px] tracking-[0.2em] text-[#8A8880]">PETSTORE © 2024</span>
        <div className="flex gap-6 text-[12px] text-[#8A8880]">
          <Link href="/about" className="text-[#0A0A0A]">About</Link>
          <Link href="/contact" className="transition-colors hover:text-[#0A0A0A]">Contact</Link>
          <Link href="/shop" className="transition-colors hover:text-[#0A0A0A]">Shop</Link>
        </div>
      </footer>
    </main>
  );
}