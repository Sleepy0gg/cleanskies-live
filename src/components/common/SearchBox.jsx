import { useEffect, useMemo, useState } from 'react';
import { loadJson, saveJson } from '../../lib/storage';

const MOCK_LOCATIONS = [
  { name: 'New York, US', lat: 40.7128, lon: -74.0060 },
  { name: 'San Francisco, US', lat: 37.7749, lon: -122.4194 },
  { name: 'London, UK', lat: 51.5074, lon: -0.1278 },
  { name: 'Tokyo, JP', lat: 35.6762, lon: 139.6503 }
];

export default function SearchBox({ onSelect }) {
  const [q, setQ] = useState('');
  const [favorites, setFavorites] = useState(() => loadJson('cs_live_favs', []));
  useEffect(() => saveJson('cs_live_favs', favorites), [favorites]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return MOCK_LOCATIONS;
    return MOCK_LOCATIONS.filter(l => l.name.toLowerCase().includes(term));
  }, [q]);

  const toggleFav = (loc) => {
    setFavorites(prev => prev.find(f => f.name === loc.name)
      ? prev.filter(f => f.name !== loc.name)
      : [...prev, loc]);
  };

  return (
    <div className="card-panel p-4">
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <label className="text-sm text-slate-300">Search location</label>
          <input className="input mt-1" value={q} onChange={(e) => setQ(e.target.value)} placeholder="City, Country" />
        </div>
      </div>
      <div className="mt-3 grid md:grid-cols-2 gap-3">
        {results.map((loc) => {
          const favored = favorites.find(f => f.name === loc.name);
          return (
            <div key={loc.name} className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
              <button className="text-left" onClick={() => onSelect?.(loc)}>
                <div className="font-semibold">{loc.name}</div>
                <div className="text-xs text-slate-400">{loc.lat.toFixed(3)}, {loc.lon.toFixed(3)}</div>
              </button>
              <button className={`btn-secondary ${favored ? 'border-accent-cyan text-accent-cyan' : ''}`} onClick={() => toggleFav(loc)}>{favored ? '★' : '☆'}</button>
            </div>
          );
        })}
      </div>
      {favorites.length > 0 && (
        <div className="mt-4">
          <div className="text-sm text-slate-300 mb-2">Favorites</div>
          <div className="flex flex-wrap gap-2">
            {favorites.map(f => (
              <button key={f.name} className="btn-secondary" onClick={() => onSelect?.(f)}>{f.name}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


