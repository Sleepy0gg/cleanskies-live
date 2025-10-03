// Air feature: Leaflet map with AQI-colored markers and geolocate shortcut
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function GeolocateButton({ onCenter }) {
  const map = useMap();
  const locate = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const coords = [pos.coords.latitude, pos.coords.longitude];
      map.setView(coords, 12);
      onCenter?.(coords);
    });
  };
  return (
    <div className="absolute z-[400] top-3 right-3">
      <button className="btn-secondary" onClick={locate}>My Location</button>
    </div>
  );
}

export default function MapView({ points = [], minAqi = 0, maxAqi = 500 }) {
  const filtered = points.filter(p => p.aqi >= minAqi && p.aqi <= maxAqi);
  const center = filtered[0] ? [filtered[0].latitude, filtered[0].longitude] : [40.7128, -74.0060];

  const colorForAqi = (aqi) => {
    if (aqi <= 50) return '#00E400';
    if (aqi <= 100) return '#FFFF00';
    if (aqi <= 150) return '#FF8C00';
    if (aqi <= 200) return '#FF0000';
    if (aqi <= 300) return '#8F3F97';
    return '#7E0023';
  };

  return (
    <div className="card-panel overflow-hidden relative">
      <MapContainer center={center} zoom={11} style={{ height: 420, width: '100%' }}>
        <GeolocateButton />
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {filtered.map((p, idx) => (
          <CircleMarker
            key={idx}
            center={[p.latitude, p.longitude]}
            radius={8}
            pathOptions={{ color: colorForAqi(p.aqi), fillColor: colorForAqi(p.aqi), fillOpacity: 0.6 }}
          >
            <Tooltip>
              <div className="text-sm">
                <div><strong>AQI:</strong> {p.aqi}</div>
                <div><strong>PM2.5:</strong> {p.pm25 ?? '—'} µg/m³</div>
              </div>
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}


