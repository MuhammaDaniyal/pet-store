import Link from "next/link";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="relative min-h-screen bg-[#F5F4F0] px-4 py-6 text-[#0A0A0A] sm:px-6 lg:px-8">
      <Link
        href="/"
        className="absolute left-4 top-4 text-sm font-medium tracking-[0.24em] text-[#0A0A0A] sm:left-6 sm:top-6"
      >
        PETSTORE
      </Link>
      <div className="flex min-h-[calc(100vh-3rem)] items-center justify-center py-12 sm:min-h-[calc(100vh-3.5rem)]">
        {children}
      </div>
    </main>
  );
}