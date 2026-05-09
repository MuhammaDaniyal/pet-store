import { PublicHeader } from "@/components/PublicHeader";
import { Footer } from "@/components/Footer";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <PublicHeader />
      <div>
        {children}
      </div>
      <Footer />
    </>
  );
}
