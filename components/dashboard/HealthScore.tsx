export function HealthScore({ mobile, desktop }: { mobile: number | null; desktop: number | null }) {
  const m = mobile ?? 0;
  const d = desktop ?? 0;
  const score = Math.round((m + d) / 2);
  return (
    <div className="rounded-xl border bg-white p-3">
      <p className="text-xs text-slate-500">Health Score</p>
      <p className="text-2xl font-bold text-slate-900">{score}</p>
    </div>
  );
}
