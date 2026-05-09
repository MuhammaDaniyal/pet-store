"use client";

import AccountSideBar from "@/components/AccountSideBar";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[280px_minmax(0,1fr)] md:items-start">
        <AccountSideBar />

        <section className="min-w-0 space-y-6">{children}</section>
      </div>
    </main>
  );
}
