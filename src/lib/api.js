// Mock API layer — UI-only. Replace with real calls later.
import sample from '../data/airQualitySample.json';

export async function fetchCurrentAirQuality() {
  await new Promise(r => setTimeout(r, 300));
  return sample.currentData;
}

export async function fetchForecast() {
  await new Promise(r => setTimeout(r, 300));
  return sample.forecast;
}

export async function fetchMapData() {
  await new Promise(r => setTimeout(r, 300));
  return sample.mapData;
}


