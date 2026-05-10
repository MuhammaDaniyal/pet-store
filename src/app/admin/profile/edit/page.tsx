import ProfileEditor from "@/components/account/ProfileEditor";
import { getCurrentUser } from "@/lib/auth-client";
import { findAccountProfileById } from "@/lib/users";

export const metadata = {
  title: "Edit Profile | Admin",
};

export default async function AdminProfileEditPage() {
  const authUser = await getCurrentUser();
  const profile = authUser ? await findAccountProfileById(authUser.userId) : null;

  return (
    <div>
      <section className="overflow-hidden rounded-[28px] border border-border bg-surface p-6 shadow-[0_16px_40px_rgba(26,83,92,0.05)]">
        <h1 className="text-2xl font-semibold text-primary mb-4">Edit Profile</h1>
        <ProfileEditor
          initialName={profile?.name || ""}
          initialPhone={profile?.phone || null}
          initialAddress={profile?.address || null}
        />
      </section>
    </div>
  );
}
