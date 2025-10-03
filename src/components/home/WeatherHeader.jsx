export default function WeatherHeader({ aqi = 72, temperature = 22, condition = 'Moderate', units = 'metric' }) {
  const gradients = [
    { upTo: 50, from: 'from-emerald-400/20', ring: 'ring-emerald-400/30' },
    { upTo: 100, from: 'from-yellow-400/20', ring: 'ring-yellow-400/30' },
    { upTo: 150, from: 'from-orange-400/20', ring: 'ring-orange-400/30' },
    { upTo: 200, from: 'from-red-400/20', ring: 'ring-red-400/30' },
    { upTo: 300, from: 'from-fuchsia-400/20', ring: 'ring-fuchsia-400/30' },
    { upTo: 9999, from: 'from-rose-500/20', ring: 'ring-rose-500/30' }
  ];
  const style = gradients.find(g => aqi <= g.upTo);
  const tempUnit = units === 'imperial' ? '°F' : '°C';

  const icon = aqi <= 50 ? '☀️' : aqi <= 100 ? '⛅' : aqi <= 150 ? '🌥️' : aqi <= 200 ? '🌫️' : aqi <= 300 ? '🌪️' : '🔥';

  return (
    <div className={`card-panel relative overflow-hidden p-6 ring-1 ${style.ring} before:absolute before:inset-0 before:bg-gradient-to-r ${style.from} to-transparent`}>
      <div className="relative z-10 flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="text-4xl drop-shadow">{icon}</div>
          <div>
            <div className="text-sm uppercase tracking-wider text-slate-300">Current Conditions</div>
            <div className="text-3xl font-extrabold tracking-tight">AQI {aqi} · {temperature}{tempUnit}</div>
            <div className="text-slate-300">{condition}</div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4 text-sm text-slate-300">
          <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">Air Quality</div>
          <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">Weather</div>
          <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">Health</div>
        </div>
      </div>
    </div>
  );
}


