import { useMemo, useState } from 'react';
import MapView from '../features/air/MapView';
import { loadJson, saveJson } from '../lib/storage';

function distance(a, b) {
  const dx = a.lat - b.lat; const dy = a.lon - b.lon; return Math.sqrt(dx*dx + dy*dy);
}

export default function RoutePlanner() {
  const [mode, setMode] = useState(() => loadJson('cs_live_mode', 'walking'));
  const [origin, setOrigin] = useState(() => loadJson('cs_live_origin', { name: 'New York, US', lat: 40.7128, lon: -74.0060 }));
  const [dest, setDest] = useState(() => loadJson('cs_live_dest', { name: 'Downtown', lat: 40.7228, lon: -74.0160 }));
  const [aqiRange, setAqiRange] = useState([0, 120]);

  const route = useMemo(() => {
    saveJson('cs_live_mode', mode); saveJson('cs_live_origin', origin); saveJson('cs_live_dest', dest);
    const steps = 20;
    const points = [];
    for (let i=0;i<=steps;i++) {
      const t = i/steps;
      let lat = origin.lat + (dest.lat - origin.lat) * t;
      let lon = origin.lon + (dest.lon - origin.lon) * t;
      const hotspot = { lat: 40.7028, lon: -74.0010, radius: 0.02 }; // mock congested area
      const d = distance({ lat, lon }, hotspot);
      if (d < hotspot.radius) {
        const angle = Math.atan2(lon - hotspot.lon, lat - hotspot.lat);
        const detour = mode === 'walking' ? 0.02 : 0.01;
        lat = hotspot.lat + Math.cos(angle) * (hotspot.radius + detour);
        lon = hotspot.lon + Math.sin(angle) * (hotspot.radius + detour);
      }
      points.push({ latitude: lat, longitude: lon, aqi: 60 + Math.round(40*Math.sin(i/3)) });
    }
    return points;
  }, [mode, origin, dest]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="card-panel p-5 mb-6">
        <h1 className="text-2xl font-extrabold mb-2">Plan Your Trip</h1>
        <p className="text-slate-300">Avoid congested hotspots and high AQI segments.</p>
        <div className="grid md:grid-cols-4 gap-3 mt-4">
          <div>
            <label className="text-sm text-slate-300">Mode</label>
            <select className="input mt-1" value={mode} onChange={(e)=>setMode(e.target.value)}>
              <option value="walking">Walking</option>
              <option value="cycling">Cycling</option>
              <option value="driving">Driving</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-300">Origin</label>
            <input className="input mt-1" value={origin.name} onChange={(e)=>setOrigin({ ...origin, name: e.target.value })} placeholder="City or place" />
          </div>
          <div>
            <label className="text-sm text-slate-300">Destination</label>
            <input className="input mt-1" value={dest.name} onChange={(e)=>setDest({ ...dest, name: e.target.value })} placeholder="City or place" />
          </div>
          <div>
            <label className="text-sm text-slate-300">AQI Preference</label>
            <input className="input mt-1" type="text" value={`${aqiRange[0]}–${aqiRange[1]}`} readOnly />
          </div>
        </div>
      </div>

      <div className="card-panel overflow-hidden relative mb-6">
        <MapView points={route} minAqi={aqiRange[0]} maxAqi={aqiRange[1]} />
      </div>

      <div className="card-panel p-5">
        <h2 className="text-lg font-bold mb-2">Route Summary</h2>
        <ul className="text-slate-300 space-y-1 text-sm">
          <li>Mode: <span className="font-semibold">{mode}</span></li>
          <li>Distance: <span className="font-semibold">~{(distance(origin, dest)*111).toFixed(1)} km</span></li>
          <li>Hotspots avoided: <span className="font-semibold">Yes</span></li>
        </ul>
      </div>
    </div>
  );
}


