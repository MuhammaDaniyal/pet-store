import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-client";
import { PublicHeader } from "@/components/PublicHeader";
import { Footer } from "@/components/Footer";
import AccountSideBar from "@/components/account/AccountSideBar";

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
      <div className="min-h-screen bg-background">
        {children}
      </div>
      <Footer />
    </>
  );
}
