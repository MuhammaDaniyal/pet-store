"use client"

import Link from "next/link";
import { useTheme } from "next-themes";
import BlurText from "@/components/BlurText";
import SplitText from "@/components/SplitText";
import AnimatedContent from "@/components/AnimatedContent";
import Magnet from "@/components/Magnet";
import CircularGallery from "@/components/CircularGallery";

const Container = ({ children }: { children: React.ReactNode }) => (
  <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
    {children}
  </div>
);

export default function HomePage() {
  const { resolvedTheme } = useTheme();

  return (
    <main className="relative isolate min-h-screen overflow-hidden font-sans">

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

        <Container>
          <div className="relative mx-auto max-w-4xl">
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 text-[24vw] font-black leading-none text-black opacity-[0.04]"
            >
              PS
            </div>

            <p className="mb-5 text-[11px] uppercase tracking-[0.35em] text-[#6B7280] sm:mb-6">
              Premium pet care — since 2024
            </p>

            <BlurText 
              text="Every companion" 
              delay={220} 
              animateBy="words" 
              direction="top"
              className="mx-auto max-w-3xl items-center justify-center text-[clamp(3rem,7vw,5rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-[#1A535C]"
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
                className="text-[clamp(3rem,7vw,5rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-[#1A535C]"
              />
            </div>

            <div className="mx-auto my-8 h-px w-20 bg-[#D6D4CE]" />

            <p className="mx-auto max-w-xl text-[15px] leading-relaxed text-[#6B7280] sm:text-base">
              Thoughtful products, reliable delivery, and a focused experience
              for pet owners who care about quality.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Magnet padding={50} disabled={false} magnetStrength={10}>
                <Link
                  href="/sign-up"
                  className="mx-2 rounded-full bg-accent px-7 py-3 text-[13px] font-medium text-[#F5F4F0] transition-all duration-200 hover:scale-[1.1] hover:shadow-[0_0_15px_#FF6B35]"
                  >
                  Create account
                </Link>
              </Magnet>
              <Magnet padding={50} disabled={false} magnetStrength={10}>
                <Link
                  href="/shop"
                  className="mx-2 rounded-full border border-[#C8C6C0] px-7 py-3 text-[13px] font-medium text-[#1A535C] transition-all duration-300 hover:scale-[1.1] hover:border-[#2A2A2A] hover:bg-[#2A2A2A] hover:text-[#FAF7F2]"
                >
                  Browse shop
                </Link>
              </Magnet>
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
            ].map((card, index) => (
              <AnimatedContent
                key={card.tag}
                distance={40}
                direction="vertical"
                reverse={false}
                duration={0.8}
                ease="power3.out"
                initialOpacity={0}
                animateOpacity
                scale={0.95}
                threshold={0.1}
                delay={0.15 + index * 0.15} 
              >
                <div className="rounded-2xl border border-border bg-surface p-7 sm:p-8 h-full">
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
              </AnimatedContent>
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

          {/* Interactive Circular Gallery */}
          <div className="relative h-[600px] w-full overflow-hidden rounded-2xl">
            <CircularGallery
              items={[
                { text: "Cats", image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&q=80" },
                { text: "Dogs", image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80" },
                { text: "Birds", image: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=600&q=80" },
                { text: "Fish", image: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=600&q=80" },
                { text: "Small Pets", image: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=600&q=80" },
                { text: "Wild Pets", image: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=600&q=80" }
              ]}
              bend={3}
              borderRadius={0.05}
              scrollSpeed={2}
              scrollEase={0.05}
              textColor={resolvedTheme === "dark" ? "#F7FFF7" : "#1A535C"}

              onItemClick={(item) => {
                const url = `/shop?category=${item.text.toLowerCase().replace(" ", "-")}`;
                console.log("Canvas Clicked! Forcing navigation to:", url);
                window.location.href = url;
              }}
            />
          </div>
        </Container>
      </section>
    </main>
  );
}