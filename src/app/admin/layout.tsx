import { AdminHeader } from "@/components/AdminHeader";
import { getCurrentUser } from "@/lib/auth-client";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin Dashboard | Petstore",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") redirect("/");

  return (
    <div className="min-h-screen bg-background text-primary selection:bg-accent/20">
      <AdminHeader />
      <main className="w-full">
        {children}
      </main>
    </div>
  );
}
