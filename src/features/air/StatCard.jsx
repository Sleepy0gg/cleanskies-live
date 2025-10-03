// Air feature: Small stat card for labeled metric
export default function StatCard({ label, value, unit, accent = 'cyan' }) {
  const ring = {
    cyan: 'ring-accent-cyan',
    lime: 'ring-accent-lime',
    magenta: 'ring-accent-magenta'
  }[accent] || 'ring-accent-cyan';

  return (
    <div className={`card-panel p-5 ring-1 ${ring}/40 shadow-inner-glow`}>
      <div className="text-sm text-slate-300">{label}</div>
      <div className="mt-2 text-2xl font-extrabold tracking-tight">
        {value}
        {unit && <span className="text-slate-400 text-base ml-1">{unit}</span>}
      </div>
    </div>
  );
}


