export default function WindHumidity({ wind = 3.4, humidity = 58 }) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="card-panel p-5">
        <div className="text-sm text-slate-300">Wind</div>
        <div className="mt-2 flex items-end gap-3">
          <div className="text-2xl font-extrabold">{wind}<span className="text-base text-slate-400 ml-1">m/s</span></div>
          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-accent-cyan" style={{ width: `${Math.min(100, wind * 12)}%` }} />
          </div>
        </div>
      </div>
      <div className="card-panel p-5">
        <div className="text-sm text-slate-300">Humidity</div>
        <div className="mt-2 flex items-end gap-3">
          <div className="text-2xl font-extrabold">{humidity}<span className="text-base text-slate-400 ml-1">%</span></div>
          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-accent-magenta" style={{ width: `${Math.min(100, humidity)}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}


