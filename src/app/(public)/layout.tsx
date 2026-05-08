import { PublicHeader } from "@/components/PublicHeader";
import { Footer } from "@/components/Footer";
import { TopBar } from "@/components/TopBar";

const Container = ({ children }: { children: React.ReactNode }) => (
  <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
    {children}
  </div>
);

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <TopBar />
      <PublicHeader />
      <div>
        {children}
      </div>
      <Footer />
    </>
  );
}
