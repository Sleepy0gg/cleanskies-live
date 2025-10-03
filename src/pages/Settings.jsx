import { useEffect, useState } from 'react';
import { useTheme } from '../lib/themeProvider.jsx';
import { loadJson, saveJson } from '../lib/storage';

export default function Settings() {
  const { theme, setTheme, themes } = useTheme();
  const [compact, setCompact] = useState(() => loadJson('cs_pref_compact', false));
  const [reduceMotion, setReduceMotion] = useState(() => loadJson('cs_pref_reduce_motion', false));
  const [autoRefresh, setAutoRefresh] = useState(() => loadJson('cs_pref_auto_refresh', true));
  const [refreshInterval, setRefreshInterval] = useState(() => loadJson('cs_pref_refresh_interval', 30));
  const [temperatureUnit, setTemperatureUnit] = useState(() => loadJson('cs_pref_temp_unit', 'celsius'));
  const [windSpeedUnit, setWindSpeedUnit] = useState(() => loadJson('cs_pref_wind_unit', 'kmh'));
  const [notifications, setNotifications] = useState(() => loadJson('cs_pref_notifications', true));
  const [soundEnabled, setSoundEnabled] = useState(() => loadJson('cs_pref_sound', true));
  const [defaultLocation, setDefaultLocation] = useState(() => loadJson('cs_pref_default_location', ''));
  const [mapStyle, setMapStyle] = useState(() => loadJson('cs_pref_map_style', 'satellite'));

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('pref-compact', !!compact);
    saveJson('cs_pref_compact', !!compact);
  }, [compact]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('pref-reduce-motion', !!reduceMotion);
    saveJson('cs_pref_reduce_motion', !!reduceMotion);
  }, [reduceMotion]);

  useEffect(() => {
    saveJson('cs_pref_auto_refresh', !!autoRefresh);
  }, [autoRefresh]);

  useEffect(() => {
    saveJson('cs_pref_refresh_interval', refreshInterval);
  }, [refreshInterval]);

  useEffect(() => {
    saveJson('cs_pref_temp_unit', temperatureUnit);
  }, [temperatureUnit]);

  useEffect(() => {
    saveJson('cs_pref_wind_unit', windSpeedUnit);
  }, [windSpeedUnit]);

  useEffect(() => {
    saveJson('cs_pref_notifications', !!notifications);
  }, [notifications]);

  useEffect(() => {
    saveJson('cs_pref_sound', !!soundEnabled);
  }, [soundEnabled]);

  useEffect(() => {
    saveJson('cs_pref_default_location', defaultLocation);
  }, [defaultLocation]);

  useEffect(() => {
    saveJson('cs_pref_map_style', mapStyle);
  }, [mapStyle]);

  const previewBg = (t) => ({
    'aurora': 'conic-gradient(from 200deg at 30% 10%, rgba(13,148,136,0.25), transparent 40%), radial-gradient(1200px 800px at 10% -10%, rgba(15,23,42,0.9), transparent), linear-gradient(180deg, #0b1222 0%, #0b1222 60%, #0a1020 100%)',
    'space-dust': 'radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,0.25) 50%, transparent 50%), radial-gradient(1px 1px at 80% 30%, rgba(255,255,255,0.2) 50%, transparent 50%), radial-gradient(1px 1px at 30% 80%, rgba(255,255,255,0.18) 50%, transparent 50%), radial-gradient(1px 1px at 60% 60%, rgba(255,255,255,0.22) 50%, transparent 50%), radial-gradient(1000px 700px at 80% 0%, rgba(236,72,153,0.15), transparent), linear-gradient(180deg, #070a14 0%, #0b1222 100%)',
    'storm': 'repeating-linear-gradient(135deg, rgba(148,163,184,0.1) 0 8px, transparent 8px 16px), radial-gradient(900px 700px at 0% 100%, rgba(59,130,246,0.12), transparent), linear-gradient(180deg, #0a0f1a 0%, #0c1426 100%)',
    'sunrise': 'conic-gradient(from 0deg at 50% 0%, rgba(251,191,36,0.18), transparent 60%), radial-gradient(1000px 700px at 0% 100%, rgba(244,114,182,0.15), transparent), linear-gradient(180deg, #130a1a 0%, #23123a 100%)'
  })[t] || 'linear-gradient(180deg, #0b1222 0%, #0a1020 100%)';

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="card-panel p-6">
        <h1 className="text-2xl font-extrabold mb-2">Settings</h1>
        <p className="text-slate-300 mb-8">Customize your CleanSkies experience.</p>

        {/* Theme Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-100 mb-4">Appearance</h2>
          <div className="mb-6">
            <label className="text-sm text-slate-300 mb-3 block">Theme</label>
            <div className="grid md:grid-cols-4 gap-3">
              {themes.map(t => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`p-4 rounded-lg border transition ${theme===t?'border-accent-cyan text-accent-cyan':'border-white/10 text-slate-100'}`}
                  style={{ background: previewBg(t), backgroundSize: 'cover' }}
                >{t.replace('-', ' ')}</button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-white/10 bg-white/5">
              <div className="text-sm text-slate-300 mb-2">Compact mode</div>
              <button className={`btn-secondary ${compact?'border-accent-cyan text-accent-cyan':''}`} onClick={() => setCompact(v => !v)}>{compact ? 'On' : 'Off'}</button>
            </div>
            <div className="p-4 rounded-xl border border-white/10 bg-white/5">
              <div className="text-sm text-slate-300 mb-2">Reduce motion</div>
              <button className={`btn-secondary ${reduceMotion?'border-accent-cyan text-accent-cyan':''}`} onClick={() => setReduceMotion(v => !v)}>{reduceMotion ? 'On' : 'Off'}</button>
            </div>
          </div>
        </div>

        {/* Data & Refresh Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-100 mb-4">Data & Refresh</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-white/10 bg-white/5">
              <div className="text-sm text-slate-300 mb-2">Auto refresh</div>
              <button className={`btn-secondary ${autoRefresh?'border-accent-cyan text-accent-cyan':''}`} onClick={() => setAutoRefresh(v => !v)}>{autoRefresh ? 'On' : 'Off'}</button>
            </div>
            <div className="p-4 rounded-xl border border-white/10 bg-white/5">
              <div className="text-sm text-slate-300 mb-2">Refresh interval: {refreshInterval}s</div>
              <input 
                type="range" 
                min="10" 
                max="300" 
                step="10"
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Units Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-100 mb-4">Units</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-white/10 bg-white/5">
              <div className="text-sm text-slate-300 mb-2">Temperature</div>
              <div className="flex gap-2">
                <button 
                  className={`btn-secondary ${temperatureUnit==='celsius'?'border-accent-cyan text-accent-cyan':''}`}
                  onClick={() => setTemperatureUnit('celsius')}
                >°C</button>
                <button 
                  className={`btn-secondary ${temperatureUnit==='fahrenheit'?'border-accent-cyan text-accent-cyan':''}`}
                  onClick={() => setTemperatureUnit('fahrenheit')}
                >°F</button>
              </div>
            </div>
            <div className="p-4 rounded-xl border border-white/10 bg-white/5">
              <div className="text-sm text-slate-300 mb-2">Wind speed</div>
              <div className="flex gap-2">
                <button 
                  className={`btn-secondary ${windSpeedUnit==='kmh'?'border-accent-cyan text-accent-cyan':''}`}
                  onClick={() => setWindSpeedUnit('kmh')}
                >km/h</button>
                <button 
                  className={`btn-secondary ${windSpeedUnit==='mph'?'border-accent-cyan text-accent-cyan':''}`}
                  onClick={() => setWindSpeedUnit('mph')}
                >mph</button>
                <button 
                  className={`btn-secondary ${windSpeedUnit==='ms'?'border-accent-cyan text-accent-cyan':''}`}
                  onClick={() => setWindSpeedUnit('ms')}
                >m/s</button>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-100 mb-4">Notifications</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-white/10 bg-white/5">
              <div className="text-sm text-slate-300 mb-2">Push notifications</div>
              <button className={`btn-secondary ${notifications?'border-accent-cyan text-accent-cyan':''}`} onClick={() => setNotifications(v => !v)}>{notifications ? 'On' : 'Off'}</button>
            </div>
            <div className="p-4 rounded-xl border border-white/10 bg-white/5">
              <div className="text-sm text-slate-300 mb-2">Sound alerts</div>
              <button className={`btn-secondary ${soundEnabled?'border-accent-cyan text-accent-cyan':''}`} onClick={() => setSoundEnabled(v => !v)}>{soundEnabled ? 'On' : 'Off'}</button>
            </div>
          </div>
        </div>

        {/* Location & Map Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-100 mb-4">Location & Map</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-white/10 bg-white/5">
              <div className="text-sm text-slate-300 mb-2">Default location</div>
              <input 
                type="text" 
                placeholder="Enter city name..."
                value={defaultLocation}
                onChange={(e) => setDefaultLocation(e.target.value)}
                className="input w-full"
              />
            </div>
            <div className="p-4 rounded-xl border border-white/10 bg-white/5">
              <div className="text-sm text-slate-300 mb-2">Map style</div>
              <div className="flex gap-2">
                <button 
                  className={`btn-secondary ${mapStyle==='satellite'?'border-accent-cyan text-accent-cyan':''}`}
                  onClick={() => setMapStyle('satellite')}
                >Satellite</button>
                <button 
                  className={`btn-secondary ${mapStyle==='street'?'border-accent-cyan text-accent-cyan':''}`}
                  onClick={() => setMapStyle('street')}
                >Street</button>
                <button 
                  className={`btn-secondary ${mapStyle==='terrain'?'border-accent-cyan text-accent-cyan':''}`}
                  onClick={() => setMapStyle('terrain')}
                >Terrain</button>
              </div>
            </div>
          </div>
        </div>

        {/* Reset Section */}
        <div className="border-t border-white/10 pt-6">
          <h2 className="text-lg font-semibold text-slate-100 mb-4">Reset</h2>
          <div className="flex gap-4">
            <button 
              className="btn-secondary"
              onClick={() => {
                if (confirm('Reset all settings to default?')) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
            >Reset all settings</button>
            <button 
              className="btn-secondary"
              onClick={() => {
                if (confirm('Clear all cached data?')) {
                  // Clear specific cache keys
                  const keys = Object.keys(localStorage).filter(key => key.startsWith('cs_'));
                  keys.forEach(key => localStorage.removeItem(key));
                  window.location.reload();
                }
              }}
            >Clear cache</button>
          </div>
        </div>
      </div>
    </div>
  );
}


