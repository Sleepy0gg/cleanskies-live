// Real API integration for production deployment
// Replace mock data with actual API calls

function getStoredKeys() {
  try {
    const raw = localStorage.getItem('cs_live_keys');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function getKey(name, envValue) {
  const store = getStoredKeys();
  return store[name] || envValue || '';
}

const API_ENDPOINTS = {
  OPEN_METEO_AQ: 'https://air-quality-api.open-meteo.com/v1/air-quality',
};

// OpenWeatherMap API - Weather data
export async function fetchWeatherData(lat, lon) {
  const OPENWEATHER = getKey('OPENWEATHER', import.meta.env.VITE_OPENWEATHER_API_KEY);
  if (!OPENWEATHER) throw new Error('OpenWeatherMap API key not configured');
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER}&units=metric`
  );
  if (!response.ok) throw new Error(`Weather API error: ${response.status}`);
  return response.json();
}

// AirVisual API - Air quality data
export async function fetchAirQualityData(lat, lon) {
  const AIRVISUAL = getKey('AIRVISUAL', import.meta.env.VITE_AIRVISUAL_API_KEY);
  if (!AIRVISUAL) {
    // Graceful fallback when no key is configured
    return {
      data: {
        current: {
          pollution: { aqius: 72, p2: 25, p1: 35, o3: 40, n2: 30, s2: 10, co: 5 }
        },
        city: 'Mock City',
        country: 'Mock Country'
      }
    };
  }
  const response = await fetch(
    `https://api.airvisual.com/v2/nearest_city?lat=${lat}&lon=${lon}&key=${AIRVISUAL}`
  );
  if (!response.ok) throw new Error(`AirVisual API error: ${response.status}`);
  return response.json();
}

// OpenRouteService API - Route planning
export async function fetchRouteData(start, end, profile = 'driving-car') {
  const OPENROUTE = getKey('OPENROUTE', import.meta.env.VITE_OPENROUTE_API_KEY);
  if (!OPENROUTE) {
    // Mock route when no key
    return { route: { distance: 10000, duration: 1200, points: [start, end] } };
  }
  const response = await fetch(
    `https://api.openrouteservice.org/v2/directions/${profile}/geojson`,
    {
      method: 'POST',
      headers: { 'Authorization': OPENROUTE, 'Content-Type': 'application/json' },
      body: JSON.stringify({ coordinates: [start, end] })
    }
  );
  if (!response.ok) throw new Error(`Route API error: ${response.status}`);
  return response.json();
}

// Satellite-like AQ from Open-Meteo (Sentinel-5P derived)
export async function fetchSatelliteAQ(lat, lon) {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    hourly: ['pm10','pm2_5','carbon_monoxide','nitrogen_dioxide','sulphur_dioxide','ozone','dust','aerosol_optical_depth'].join(','),
    timezone: 'auto'
  });
  const url = `${API_ENDPOINTS.OPEN_METEO_AQ}?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Open-Meteo AQ error: ${res.status}`);
  const data = await res.json();
  const idx = data.hourly?.time?.length ? data.hourly.time.length - 1 : -1;
  const pick = (k) => idx >= 0 && data.hourly?.[k] ? data.hourly[k][idx] : null;
  return {
    time: idx >= 0 ? data.hourly.time[idx] : null,
    pm10: pick('pm10'),
    pm25: pick('pm2_5'),
    co: pick('carbon_monoxide'),
    no2: pick('nitrogen_dioxide'),
    so2: pick('sulphur_dioxide'),
    o3: pick('ozone'),
    dust: pick('dust'),
    aod: pick('aerosol_optical_depth')
  };
}

export async function fetchSatelliteAQForecast(lat, lon, hours = 72) {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    hourly: ['pm10','pm2_5','nitrogen_dioxide','ozone'].join(','),
    timezone: 'auto'
  });
  const url = `${API_ENDPOINTS.OPEN_METEO_AQ}?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Open-Meteo AQ error: ${res.status}`);
  const data = await res.json();
  const n = Math.min(hours, data.hourly.time.length);
  return {
    time: data.hourly.time.slice(0, n),
    pm25: data.hourly.pm2_5.slice(0, n),
    pm10: data.hourly.pm10.slice(0, n),
    no2: data.hourly.nitrogen_dioxide.slice(0, n),
    o3: data.hourly.ozone.slice(0, n)
  };
}

// Ground stations via OpenAQ
export async function fetchOpenAQLatest(lat, lon, radiusMeters = 25000, limit = 50) {
  const url = `https://api.openaq.org/v2/latest?coordinates=${lat},${lon}&radius=${radiusMeters}&limit=${limit}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`OpenAQ error: ${res.status}`);
  const data = await res.json();
  return data.results || [];
}

// Geocoding service
export async function geocodeLocation(query) {
  const OPENWEATHER = getKey('OPENWEATHER', import.meta.env.VITE_OPENWEATHER_API_KEY);
  const response = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${OPENWEATHER}`
  );
  if (!response.ok) throw new Error(`Geocoding API error: ${response.status}`);
  return response.json();
}

// Combined data fetcher
export async function fetchLocationData(lat, lon) {
  const [weather, airQuality, sat] = await Promise.all([
    fetchWeatherData(lat, lon),
    fetchAirQualityData(lat, lon),
    fetchSatelliteAQ(lat, lon)
  ]);
  return {
    weather: {
      temperature: weather.main.temp,
      humidity: weather.main.humidity,
      windSpeed: weather.wind.speed,
      condition: weather.weather[0].main,
      description: weather.weather[0].description
    },
    airQuality: {
      aqi: airQuality.data.current.pollution.aqius,
      pm25: airQuality.data.current.pollution.p2,
      pm10: airQuality.data.current.pollution.p1,
      o3: airQuality.data.current.pollution.o3,
      no2: airQuality.data.current.pollution.n2,
      so2: airQuality.data.current.pollution.s2,
      co: airQuality.data.current.pollution.co
    },
    satellite: sat,
    location: { city: airQuality.data.city, country: airQuality.data.country, coordinates: { lat, lon } }
  };
}

export async function fetchCurrentAirQuality() {
  try {
    const position = await new Promise((resolve, reject) => {
      if (!navigator.geolocation) return resolve({ coords: { latitude: 40.7128, longitude: -74.0060 } });
      navigator.geolocation.getCurrentPosition(resolve, () => resolve({ coords: { latitude: 40.7128, longitude: -74.0060 } }), { enableHighAccuracy: true, timeout: 5000 });
    });
    return await fetchLocationData(position.coords.latitude, position.coords.longitude);
  } catch (e) {
    // Final fallback
    return await fetchLocationData(40.7128, -74.0060);
  }
}

export async function fetchForecast() {
  // Use Open‑Meteo forecast returning NO2/O3/PM25 arrays
  const pos = { coords: { latitude: 40.7128, longitude: -74.0060 } };
  const fc = await fetchSatelliteAQForecast(pos.coords.latitude, pos.coords.longitude, 24);
  // Map to existing chart structure
  return fc.time.map((t, i) => ({ time: t, aqi: Math.max(20, Math.round((fc.pm25[i] || 10) * 4)), pollutant: 'pm25', value: fc.pm25[i] || 10 }));
}

export async function fetchMapData() {
  // Derive simple map points from OpenAQ around NYC as placeholder
  const pts = await fetchOpenAQLatest(40.7128, -74.0060, 50000, 100);
  return pts.map((s) => ({ lat: s.coordinates.latitude, lon: s.coordinates.longitude, aqi: (s.measurements?.find(m=>m.parameter==='pm25')?.value || 10) * 4 }));
}
