import { AdminProfileSidebar } from "@/components/admin/AdminProfileSidebar";

export const metadata = {
  title: "Admin Profile | Petstore",
};

export default function AdminProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="w-full shrink-0 lg:sticky lg:top-32 h-fit">
          <AdminProfileSidebar />
        </aside>

        <main className="min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
