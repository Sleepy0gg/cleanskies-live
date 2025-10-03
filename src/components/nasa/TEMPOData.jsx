import { useState, useEffect } from 'react';
import { fetchSatelliteAQ, fetchSatelliteAQForecast, fetchOpenAQLatest } from '../../lib/realApi';

export default function TEMPOData({ lat, lon }) {
  const [satellite, setSatellite] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [hotspots, setHotspots] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!lat || !lon) return;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [sat, fc, openaq] = await Promise.all([
          fetchSatelliteAQ(lat, lon),
          fetchSatelliteAQForecast(lat, lon, 48),
          fetchOpenAQLatest(lat, lon, 25000, 25)
        ]);

        setSatellite(sat);
        setForecast(fc);
        // Derive simple hotspots list from OpenAQ latest by highest PM2.5
        const spots = (openaq || [])
          .map((s) => {
            const pm25 = (s.measurements || []).find((m) => m.parameter === 'pm25');
            return {
              region: s.city || s.location || 'Station',
              aqi: pm25 ? pm25.value : null,
              timestamp: pm25 ? pm25.lastUpdated : s.date?.utc || Date.now(),
            };
          })
          .filter((x) => x.aqi != null)
          .sort((a, b) => b.aqi - a.aqi)
          .slice(0, 5);
        setHotspots(spots);
      } catch (err) {
        console.error('Failed to load satellite/openaq data:', err);
        setError('Satellite data unavailable');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [lat, lon]);

  if (loading) {
    return (
      <div className="card-panel p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center">🛰️</div>
          <h3 className="text-lg font-semibold text-slate-100">Satellite Air Quality</h3>
        </div>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-slate-700 rounded w-3/4"></div>
          <div className="h-4 bg-slate-700 rounded w-1/2"></div>
          <div className="h-4 bg-slate-700 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (error || !satellite) {
    return (
      <div className="card-panel p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-8 rounded-full bg-red-500/20 flex items-center justify-center">🛰️</div>
          <h3 className="text-lg font-semibold text-slate-100">Satellite Air Quality</h3>
        </div>
        <p className="text-slate-400">Satellite data unavailable</p>
      </div>
    );
  }

  return (
    <div className="card-panel p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center">🛰️</div>
        <div>
          <h3 className="text-lg font-semibold text-slate-100">Satellite Air Quality</h3>
          <p className="text-xs text-slate-400">Powered by Open‑Meteo (Sentinel‑5P derived) + OpenAQ</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white/5 rounded-lg p-3">
          <div className="text-sm text-slate-400 mb-1">NO₂ (µg/m³)</div>
          <div className="text-lg font-bold text-blue-400">{satellite.no2 ?? '—'}</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3">
          <div className="text-sm text-slate-400 mb-1">O₃ (µg/m³)</div>
          <div className="text-lg font-bold text-green-400">{satellite.o3 ?? '—'}</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3">
          <div className="text-sm text-slate-400 mb-1">PM2.5 (µg/m³)</div>
          <div className="text-lg font-bold text-pink-400">{satellite.pm25 ?? '—'}</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3">
          <div className="text-sm text-slate-400 mb-1">PM10 (µg/m³)</div>
          <div className="text-lg font-bold text-orange-400">{satellite.pm10 ?? '—'}</div>
        </div>
      </div>

      {forecast?.time && (
        <div className="bg-white/5 rounded-lg p-3">
          <div className="text-sm text-slate-400 mb-2">Next 48h trend (NO₂ / O₃)</div>
          <div className="text-xs text-slate-400">{forecast.time[0]} → {forecast.time[forecast.time.length - 1]}</div>
        </div>
      )}

      {hotspots && hotspots.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-slate-300 mb-2">Nearby Hotspots (OpenAQ)</h4>
          <div className="space-y-2">
            {hotspots.map((spot, index) => (
              <div key={index} className="flex items-center justify-between bg-white/5 rounded-lg p-2">
                <div>
                  <div className="text-sm font-medium text-slate-200">{spot.region}</div>
                  <div className="text-xs text-slate-400">PM2.5: {spot.aqi}</div>
                </div>
                <div className="text-xs text-slate-400">{new Date(spot.timestamp).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
