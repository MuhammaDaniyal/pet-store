"use client";

import AccountSideBar from "@/components/AccountSideBar";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <AccountSideBar />

        {/* Content */}
        <section className="md:col-span-3">
          {children}
        </section>
      </div>
    </main>
  );
}
