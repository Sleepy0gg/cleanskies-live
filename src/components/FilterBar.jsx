export default function FilterBar({ filters, onChange }) {
  const set = (key, value) => onChange({ ...filters, [key]: value });
  return (
    <div className="card-panel p-4 flex flex-col md:flex-row gap-3 items-end">
      <div className="flex-1">
        <label className="text-sm text-slate-300">AQI Min</label>
        <input className="input mt-1" type="number" value={filters.minAqi} onChange={(e) => set('minAqi', Number(e.target.value))} />
      </div>
      <div className="flex-1">
        <label className="text-sm text-slate-300">AQI Max</label>
        <input className="input mt-1" type="number" value={filters.maxAqi} onChange={(e) => set('maxAqi', Number(e.target.value))} />
      </div>
      <div className="flex-1">
        <label className="text-sm text-slate-300">Pollutant Display</label>
        <select className="input mt-1" value={filters.pollutant} onChange={(e) => set('pollutant', e.target.value)}>
          <option value="pm25">PM2.5</option>
          <option value="pm10">PM10</option>
          <option value="o3">O₃</option>
          <option value="no2">NO₂</option>
          <option value="so2">SO₂</option>
          <option value="co">CO</option>
        </select>
      </div>
      <div>
        <label className="text-sm text-slate-300">Units</label>
        <select className="input mt-1" value={filters.units} onChange={(e) => set('units', e.target.value)}>
          <option value="metric">Metric</option>
          <option value="imperial">Imperial</option>
        </select>
      </div>
    </div>
  );
}


