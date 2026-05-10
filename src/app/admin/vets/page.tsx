import { connectToDatabase } from "@/lib/db";
import { Vet } from "@/lib/models/Vet";
import { VetRow } from "./VetRow";

export const metadata = {
  title: "Vets Management | Admin Dashboard",
};

export default async function AdminVetsPage() {
  await connectToDatabase();
  const vets = await Vet.find().populate("user", "name email").lean();

  return (
    <div className="p-8 sm:p-12">
      <h1 className="text-3xl font-semibold tracking-tight text-primary">Vets Management</h1>
      <p className="mt-2 text-secondary">Manage and verify veterinarian profiles across the platform.</p>

      <div className="mt-8 overflow-x-auto rounded-[28px] border border-border bg-surface shadow-[0_16px_40px_rgba(26,83,92,0.05)]">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="border-b border-border bg-background/50">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted">Name</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted">Email</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted">Specialization</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted">Fee</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted">Status</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vets.map((vet: any) => (
              <VetRow key={vet._id.toString()} vet={JSON.parse(JSON.stringify(vet))} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
