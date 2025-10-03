// Air feature: Minimal SVG area chart for AQI forecast
export default function ForecastChart({ points = [] }) {
  if (!points?.length) return (
    <div className="card-panel p-5 text-slate-300">No forecast data.</div>
  );

  const minAqi = Math.min(...points.map(p => p.aqi));
  const maxAqi = Math.max(...points.map(p => p.aqi));
  const padding = 10;
  const width = 560;
  const height = 160;
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;

  const xs = points.map((_, i) => padding + (i / (points.length - 1)) * innerW);
  const ys = points.map(p => {
    const t = (p.aqi - minAqi) / Math.max(1, (maxAqi - minAqi));
    return padding + innerH - t * innerH;
  });
  const path = xs.map((x, i) => `${i === 0 ? 'M' : 'L'} ${x} ${ys[i]}`).join(' ');

  return (
    <div className="card-panel p-5">
      <h3 className="text-lg font-bold mb-3">AQI Forecast</h3>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="180">
        <defs>
          <linearGradient id="aqiGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width={width} height={height} fill="transparent" />
        <path d={path} fill="none" stroke="#22d3ee" strokeWidth="2" />
        <path d={`${path} L ${padding + innerW} ${padding + innerH} L ${padding} ${padding + innerH} Z`} fill="url(#aqiGrad)" opacity="0.5" />
        {xs.map((x, i) => (
          <circle key={i} cx={x} cy={ys[i]} r="3" fill="#22d3ee" />
        ))}
      </svg>
      <div className="mt-2 text-sm text-slate-400">
        Range: {minAqi}–{maxAqi} AQI
      </div>
    </div>
  );
}


