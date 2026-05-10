import { AdminProfileSidebar } from "@/components/admin/AdminProfileSidebar";

export const metadata = {
  title: "Admin Profile | Petstore",
};

export default function AdminProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-8 py-12 sm:px-12">
      <div className="flex flex-col gap-12 lg:flex-row lg:items-start">
        <aside className="w-full shrink-0 lg:sticky lg:top-32 lg:w-64">
          <AdminProfileSidebar />
        </aside>
        <div className="min-w-0 flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
