import { PublicHeader } from "@/components/PublicHeader";

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
      <PublicHeader />
      <div>
        {children}
      </div>
    </>
  );
}
