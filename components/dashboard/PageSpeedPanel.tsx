export function PageSpeedPanel({ mobile, desktop }: { mobile: number | null; desktop: number | null }) {
  return (
    <section className="rounded-2xl border bg-white p-4">
      <h2 className="font-semibold text-slate-900">PageSpeed</h2>
      <div className="mt-2 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Mobile</p>
          <p className="text-2xl font-bold">{mobile ?? "-"}</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Desktop</p>
          <p className="text-2xl font-bold">{desktop ?? "-"}</p>
        </div>
      </div>
    </section>
  );
}
