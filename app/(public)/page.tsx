import Link from "next/link";

const Container = ({ children }: { children: React.ReactNode }) => (
  <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
    {children}
  </div>
);

export default function HomePage() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#F5F4F0] px-4 font-sans sm:px-6 lg:px-8">

      {/* Grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "180px 180px",
        }}
      />

      {/* NAV */}
      <header className="relative z-10 pt-5 pb-4 sm:pt-6 sm:pb-5">
        <Container>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-[0.28em] text-[#0A0A0A]">
              PETSTORE
            </span>

            <nav className="flex items-center gap-3">
              <Link
                href="/sign-in"
                className="rounded-full border border-[#C8C6C0] px-5 py-2 text-[13px] text-[#4A4945] hover:border-[#0A0A0A] hover:text-[#0A0A0A]"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="rounded-full bg-[#0A0A0A] px-5 py-2 text-[13px] font-medium text-[#F5F4F0] hover:bg-[#2A2A2A]"
              >
                Join now
              </Link>
            </nav>
          </div>
        </Container>
      </header>

      {/* HERO */}
      <section className="relative z-10 py-20 text-center sm:py-28 lg:py-32">
        <Container>
          <div className="relative mx-auto max-w-4xl">
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 text-[24vw] font-black leading-none text-black opacity-[0.04]"
            >
              PS
            </div>

            <p className="mb-5 text-[11px] uppercase tracking-[0.35em] text-[#8A8880] sm:mb-6">
              Premium pet care — since 2024
            </p>

            <h1 className="mx-auto max-w-3xl text-[clamp(3rem,7vw,5rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-[#0A0A0A]">
              Every companion <br />
              <span className="text-[#6A6860] font-normal">deserves</span> the best.
            </h1>

            <div className="mx-auto my-8 h-px w-20 bg-[#D6D4CE]" />

            <p className="mx-auto max-w-xl text-[15px] leading-relaxed text-[#4A4945] sm:text-base">
              Thoughtful products, reliable delivery, and a focused experience
              for pet owners who care about quality.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link
                href="/sign-up"
                className="rounded-full bg-[#0A0A0A] px-7 py-3 text-[13px] font-medium text-[#F5F4F0] hover:bg-[#2A2A2A]"
              >
                Create account
              </Link>
              <Link
                href="/shop"
                className="rounded-full border border-[#C8C6C0] px-7 py-3 text-[13px] font-medium text-[#0A0A0A] hover:border-[#0A0A0A]"
              >
                Browse shop
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* CARDS */}
      <section className="relative z-10 pb-20 sm:pb-24 lg:pb-28">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {[
              {
                tag: "Delivery",
                title: "Door-to-door, fast.",
                body: "Order by midnight, arrives the next morning. Live tracking included.",
              },
              {
                tag: "Catalogue",
                title: "600+ products.",
                body: "Carefully curated essentials for all types of pets.",
              },
              {
                tag: "Account",
                title: "Everything in one place.",
                body: "Wishlist, orders, and fast reordering.",
              },
            ].map((card) => (
              <div
                key={card.tag}
                className="rounded-2xl border border-[#D6D4CE] bg-[#EDECE8] p-7 sm:p-8"
              >
                <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#8A8880]">
                  {card.tag}
                </span>

                <p className="mt-4 text-lg font-medium text-[#0A0A0A]">
                  {card.title}
                </p>

                <p className="mt-2 text-sm leading-relaxed text-[#4A4945]">
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#D6D4CE] py-10 sm:py-12">
        <Container>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-[11px] tracking-[0.2em] text-[#8A8880]">
              PETSTORE © 2024
            </span>

            <div className="flex gap-6 text-[12px] text-[#8A8880]">
              <Link href="/about" className="hover:text-black">About</Link>
              <Link href="/contact" className="hover:text-black">Contact</Link>
              <Link href="/shop" className="hover:text-black">Shop</Link>
            </div>
          </div>
        </Container>
      </footer>
    </main>
  );
}