import { ClientDashboard } from "@/app/dashboard/ClientDashboard";
import { listSites } from "@/lib/db";

export default async function DashboardPage() {
  const sites = await listSites();
  return (
    <section>
      <header className="mb-5">
        <h1 className="text-2xl font-bold text-slate-900">Website Management</h1>
        <p className="text-slate-600">Manage connected Optimization Genie plugin installs.</p>
      </header>
      {sites.length === 0 ? <p className="text-slate-500">No websites registered yet.</p> : <ClientDashboard initialSites={sites} />}
    </section>
  );
}
