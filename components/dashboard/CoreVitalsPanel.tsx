export function CoreVitalsPanel({ lcp, cls, inp }: { lcp?: number; cls?: number; inp?: number }) {
  return (
    <section className="rounded-2xl border bg-white p-4">
      <h2 className="font-semibold text-slate-900">Core Web Vitals</h2>
      <div className="mt-2 grid grid-cols-3 gap-3 text-sm">
        <div className="rounded-xl bg-slate-50 p-3">LCP: {lcp ?? "-"}</div>
        <div className="rounded-xl bg-slate-50 p-3">CLS: {cls ?? "-"}</div>
        <div className="rounded-xl bg-slate-50 p-3">INP: {inp ?? "-"}</div>
      </div>
    </section>
  );
}
