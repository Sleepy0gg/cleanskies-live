// Air feature: Banner showing current AQI with severity tint
export default function AlertBanner({ aqi = 72 }) {
  const color =
    aqi <= 50 ? 'from-emerald-500/30' :
    aqi <= 100 ? 'from-yellow-500/30' :
    aqi <= 150 ? 'from-orange-500/30' :
    aqi <= 200 ? 'from-red-500/30' :
    aqi <= 300 ? 'from-fuchsia-500/30' : 'from-rose-600/30';

  return (
    <div className={`card-panel relative overflow-hidden p-4 before:absolute before:inset-0 before:bg-gradient-to-r ${color} to-transparent`}>
      <div className="relative z-10 flex items-center justify-between gap-4">
        <div>
          <div className="text-sm uppercase tracking-wider text-slate-300">Air Quality Alert</div>
          <div className="text-xl font-bold">Current AQI: {aqi}</div>
        </div>
        <a href="#recommendations" className="btn-primary">Recommendations</a>
      </div>
    </div>
  );
}


