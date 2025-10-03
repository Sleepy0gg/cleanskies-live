import { useEffect, useMemo, useState } from 'react';
import AlertBanner from '../features/air/AlertBanner';
import StatCard from '../features/air/StatCard';
import MapView from '../features/air/MapView';
import ForecastChart from '../features/air/ForecastChart';
import FilterBar from '../components/FilterBar';
import WeatherHeader from '../components/home/WeatherHeader';
import WindHumidity from '../components/home/WindHumidity';
import SearchBox from '../components/common/SearchBox';
import TEMPOData from '../components/nasa/TEMPOData';
import { fetchCurrentAirQuality, fetchForecast, fetchMapData } from '../lib/realApi';
import { loadJson, saveJson } from '../lib/storage';

export default function Home() {
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [mapData, setMapData] = useState([]);
  const [filters, setFilters] = useState(() => loadJson('cs_live_filters', { minAqi: 0, maxAqi: 200, pollutant: 'pm25', units: 'metric' }));
  const [tab, setTab] = useState('overview');
  const [forecastMode, setForecastMode] = useState('hourly');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const [c, f, m] = await Promise.all([
          fetchCurrentAirQuality(),
          fetchForecast(),
          fetchMapData()
        ]);
        setCurrent(c);
        setForecast(f);
        setMapData(m);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load air quality data. Please try again.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    saveJson('cs_live_filters', filters);
  }, [filters]);

  const temperature = useMemo(() => {
    if (current?.weather?.temperature == null) return '—';
    const c = current.weather.temperature;
    if (filters.units === 'imperial') {
      return Math.round((c * 9) / 5 + 32);
    }
    return c;
  }, [current, filters.units]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-cyan mx-auto mb-4"></div>
            <p className="text-slate-300">Loading air quality data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="card-panel p-8 text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-slate-100 mb-2">Unable to Load Data</h2>
          <p className="text-slate-300 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6">
        <WeatherHeader aqi={current?.aqi?.value ?? 72} temperature={temperature} condition={current?.aqi?.category ?? 'Moderate'} units={filters.units} />
      </div>

      <div className="mb-6">
        <FilterBar filters={filters} onChange={setFilters} />
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <StatCard label="AQI" value={current?.aqi?.value ?? '—'} accent="cyan" />
        <StatCard label="PM2.5" value={current?.pollutants?.pm25?.value ?? '—'} unit="µg/m³" accent="magenta" />
        <StatCard label="PM10" value={current?.pollutants?.pm10?.value ?? '—'} unit="µg/m³" accent="lime" />
        <StatCard label="Temp" value={temperature} unit={filters.units === 'imperial' ? '°F' : '°C'} accent="cyan" />
      </div>

      <div className="mb-6">
        <WindHumidity wind={current?.weather?.windSpeed ?? 0} humidity={current?.weather?.humidity ?? 0} />
      </div>

      <div className="mb-6">
        <div className="card-panel p-2 flex items-center gap-2">
          {['overview','forecast','map','sensors','search'].map(t => (
            <button key={t} className={`btn-secondary ${tab===t?'border-accent-cyan text-accent-cyan':''}`} onClick={()=>setTab(t)}>
              {t.charAt(0).toUpperCase()+t.slice(1)}
            </button>
          ))}
          {tab==='forecast' && (
            <div className="ml-auto flex items-center gap-2">
              <span className="text-sm text-slate-300">Mode</span>
              {['hourly','daily'].map(m => (
                <button key={m} className={`btn-secondary ${forecastMode===m?'border-accent-cyan text-accent-cyan':''}`} onClick={()=>setForecastMode(m)}>{m}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      {tab==='overview' && (
        <div className="mb-8">
          <MapView points={mapData} minAqi={filters.minAqi} maxAqi={filters.maxAqi} />
        </div>
      )}

      {tab==='forecast' && (
        <section className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <ForecastChart points={forecast} />
          </div>
          <div className="card-panel p-5">
            <h3 className="text-lg font-bold mb-2">Health Guidance</h3>
            <p className="text-slate-300">Based on your profile and current AQI.</p>
            <ul className="mt-3 list-disc pl-5 text-slate-300 space-y-1">
              <li>Limit outdoor activities when AQI &gt; 100.</li>
              <li>Wear a mask if sensitive to PM2.5.</li>
              <li>Keep windows closed during peaks.</li>
            </ul>
          </div>
        </section>
      )}

      {tab==='map' && (
        <div className="mb-8">
          <MapView points={mapData} minAqi={filters.minAqi} maxAqi={filters.maxAqi} />
        </div>
      )}

      {tab==='sensors' && (
        <section className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <TEMPOData lat={current?.location?.coordinates?.lat || 40.7128} lon={current?.location?.coordinates?.lon || -74.0060} />
          </div>
          <div className="card-panel p-5">
            <h3 className="text-lg font-bold mb-2">Ground Sensors</h3>
            <p className="text-slate-300 mb-4">Local monitoring stations provide real-time measurements.</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">PM2.5 Sensor</span>
                <span className="text-green-400">Active</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">PM10 Sensor</span>
                <span className="text-green-400">Active</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">O₃ Monitor</span>
                <span className="text-green-400">Active</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">NO₂ Monitor</span>
                <span className="text-green-400">Active</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {tab==='search' && (
        <div className="mb-8">
          <SearchBox onSelect={(loc) => console.log('Selected', loc)} />
        </div>
      )}
    </div>
  );
}


