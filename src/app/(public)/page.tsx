import Link from "next/link";
import Image from "next/image";
import BlurText from "@/components/BlurText";
import SplitText from "@/components/SplitText";

const Container = ({ children }: { children: React.ReactNode }) => (
  <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
    {children}
  </div>
);

export default function HomePage() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-background font-sans">

      {/* Grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "180px 180px",
        }}
      />

      {/* HERO */}
      <section className="relative z-10 py-20 text-center sm:py-28 lg:py-32">

        {/* Background Video */}
        <video autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover -z-20">
          <source src="/cat-walking-transparent.mp4" type="video/mp4" />
        </video>

        {/* Semi-transparent Overlay 
        <div className="absolute inset-0 bg-background/50 -z-10" />*/}

        <Container>
          <div className="relative mx-auto max-w-4xl">
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 text-[24vw] font-black leading-none text-black opacity-[0.04]"
            >
              PS
            </div>

            <p className="mb-5 text-[11px] uppercase tracking-[0.35em] text-muted sm:mb-6">
              Premium pet care — since 2024
            </p>

            <BlurText 
              text="Every companion" 
              delay={220} 
              animateBy="words" 
              direction="top"
              className="mx-auto max-w-3xl items-center justify-center text-[clamp(3rem,7vw,5rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-primary"
            />
            <div className="flex flex-wrap items-center justify-center">
              <BlurText 
                text="deserves" 
                delay={420} 
                animateBy="words" 
                direction="top"
                className="text-[clamp(3rem,7vw,5rem)] font-normal leading-[0.95] tracking-[-0.04em] text-[#6A6860]"
              />
              <BlurText 
                text=" the best." 
                delay={420} 
                animateBy="words" 
                direction="top"
                className="text-[clamp(3rem,7vw,5rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-primary"
              />
            </div>

            <div className="mx-auto my-8 h-px w-20 bg-[#D6D4CE]" />

            <p className="mx-auto max-w-xl text-[15px] leading-relaxed text-secondary sm:text-base">
              Thoughtful products, reliable delivery, and a focused experience
              for pet owners who care about quality.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link
                href="/sign-up"
                className="rounded-full bg-accent px-7 py-3 text-[13px] font-medium text-[#F5F4F0] hover:bg-[#2A2A2A]"
              >
                Create account
              </Link>
              <Link
                href="/shop"
                className="rounded-full border border-[#C8C6C0] px-7 py-3 text-[13px] font-medium text-primary hover:border-[#0A0A0A]"
              >
                Browse shop
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* CARDS */}
      <section className="relative z-10 pb-20 sm:pb-24 lg:pb-28 pt-10">
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
                className="rounded-2xl border border-border bg-surface p-7 sm:p-8"
              >
                <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted">
                  {card.tag}
                </span>

                <p className="mt-4 text-lg font-medium text-primary">
                  {card.title}
                </p>

                <p className="mt-2 text-sm leading-relaxed text-secondary">
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CATEGORIES */}
      <section className="relative z-10 pb-20 sm:pb-24 lg:pb-28">
        <Container>
          <div className="flex w-full justify-center">
            <SplitText
              tag="h2"
              text="Explore Our Categories"
              className="mb-10 text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-tight tracking-[-0.03em] text-primary"
              delay={30}
              duration={1}
              ease="elastic.out(1, 0.3)"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="center"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {[
              { emoji: "🐱", name: "Cats",       count: 34, img: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&q=80" },
              { emoji: "🐶", name: "Dogs",       count: 45, img: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80" },
              { emoji: "🦜", name: "Birds",      count: 21, img: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=600&q=80" },
              { emoji: "🐟", name: "Fish",       count: 18, img: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=600&q=80" },
              { emoji: "🐭", name: "Small Pets", count: 12, img: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=600&q=80" },
              { emoji: "🦁", name: "Wild Pets",  count: 9,  img: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=600&q=80" },
            ].map((cat) => (
              <Link
                key={cat.name}
                href={`/shop?category=${cat.name.toLowerCase().replace(" ", "-")}`}
                className="group relative overflow-hidden rounded-2xl"
                style={{ aspectRatio: "4/3" }}
              >
                {/* Background image */}
                <Image
                  src={cat.img}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5 text-center text-white">
                  <span className="text-3xl">{cat.emoji}</span>
                  <p className="mt-1 text-[1.15rem] font-semibold tracking-[-0.01em] text-white/90">
                    {cat.name}
                  </p>
                  <p className="mt-0.5 text-[12px] font-normal text-white/70">
                    {cat.count} pets available
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}