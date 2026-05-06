import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-client";
import { PublicHeader } from "@/components/PublicHeader";
import AccountSideBar from "@/components/AccountSideBar";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <>
      <PublicHeader />
      <div className="min-h-screen bg-[#F5F4F0]">
        {children}
      </div>
    </>
  );
}
