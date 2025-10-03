import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// Robust .env loading: try server/.env, project/.env, and default
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tried = [];
const tryLoad = (p) => { tried.push(p); return dotenv.config({ path: p }); };
tryLoad(path.join(__dirname, '.env'));
if (!process.env.TEMPO_EDL_TOKEN) tryLoad(path.join(process.cwd(), 'server', '.env'));
if (!process.env.TEMPO_EDL_TOKEN) tryLoad(path.join(process.cwd(), '.env'));
if (!process.env.TEMPO_EDL_TOKEN) dotenv.config();

dotenv.config({ path: new URL('./.env', import.meta.url).pathname });

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/tempo/health', (req, res) => {
  const hasToken = Boolean(process.env.TEMPO_EDL_TOKEN && process.env.TEMPO_EDL_TOKEN.trim());
  const hasBbox = Boolean(process.env.TEMPO_DEFAULT_BBOX && process.env.TEMPO_DEFAULT_BBOX.trim());
  return res.json({ ok: true, hasToken, hasBbox });
});

// --- STEP 1: CMR search for TEMPO granules (NO2 Level-2) ---
async function cmrSearch({ shortName, collectionId, temporal, bbox, pageSize = 25 }) {
  const url = new URL('https://cmr.earthdata.nasa.gov/search/granules.json');
  if (collectionId) url.searchParams.set('collection_concept_id', collectionId);
  else url.searchParams.set('short_name', shortName);
  url.searchParams.set('temporal', temporal);
  if (bbox) url.searchParams.set('bounding_box', bbox);
  url.searchParams.set('page_size', String(pageSize));

  const r = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${process.env.TEMPO_EDL_TOKEN || ''}`,
      'Client-Id': 'cleanskies-tempo-app'
    }
  });
  if (!r.ok) throw new Error(`CMR error: ${r.status}`);
  return r.json();
}

app.get('/api/tempo/cmr-search', async (req, res) => {
  try {
    const bbox = (req.query.bbox || process.env.TEMPO_DEFAULT_BBOX || '-125,24,-66,50').trim();
    const temporal = (() => {
      if (req.query.temporal) return String(req.query.temporal);
      const end = new Date();
      const start = new Date(end.getTime() - 48 * 3600 * 1000);
      const iso = (d) => d.toISOString().split('.')[0] + 'Z';
      return `${iso(start)},${iso(end)}`;
    })();
    const shortName = req.query.short_name || 'TEMPO_L2_NO2';
    const collectionId = req.query.collection_concept_id;

    const data = await cmrSearch({ shortName, collectionId, temporal, bbox, pageSize: 10 });
    const summaries = (data.feed?.entry || []).map((e) => ({
      id: e.id,
      title: e.title,
      time_start: e.time_start,
      time_end: e.time_end,
      links: (e.links || []).filter(l => l.href && /https?:\/\//.test(l.href)).map(l => ({ href: l.href, rel: l.rel, type: l.type }))
    }));
    return res.json({ ok: true, bbox, temporal, shortName, collectionId, count: summaries.length, items: summaries });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
});

// --- STEP 2: Extract latest TEMPO NO2 grid over bbox (calls Python helper) ---
app.get('/api/tempo/latest', async (req, res) => {
  try {
    const bbox = (req.query.bbox || process.env.TEMPO_DEFAULT_BBOX || '-125,24,-66,50').trim();
    const temporal = (() => {
      if (req.query.temporal) return String(req.query.temporal);
      const end = new Date();
      const start = new Date(end.getTime() - 24 * 3600 * 1000);
      const iso = (d) => d.toISOString().split('.')[0] + 'Z';
      return `${iso(start)},${iso(end)}`;
    })();
    const shortName = 'TEMPO_L2_NO2';

    // 1) Find a recent granule via CMR
    const collectionId = req.query.collection_concept_id;
    const cmr = await cmrSearch({ shortName, collectionId, temporal, bbox, pageSize: 5 });
    const entries = cmr.feed?.entry || [];
    if (!entries.length) return res.status(404).json({ ok: false, error: 'no_granules' });
    const links = entries[0].links || [];
    // Prefer direct HTTPS data links over OPeNDAP
    const dataLink = links.find(l => l.href && l.href.includes('asdc-prod-protected') && l.rel && l.rel.includes('data#'))?.href || 
                     links.find(l => l.href && /https?:\/\//.test(l.href) && (!l.rel || l.rel.includes('data')))?.href || 
                     links.find(l => l.href)?.href;
    if (!dataLink) return res.status(404).json({ ok: false, error: 'no_data_link' });

    // 2) Call Python helper to open NetCDF and emit a light grid JSON
    console.log('Calling Python with:', {
      dataLink,
      bbox,
      vars: req.query.vars || 'no2,o3'
    });
    
    const py = spawn('python', [
      './server/parser/tempo_extract.py',
      `--granule-url=${dataLink}`,
      `--bbox=${bbox}`,
      `--vars=${(req.query.vars || 'no2,o3').toString()}`
    ], {
      cwd: process.cwd(),
      env: { ...process.env, TEMPO_EDL_TOKEN: process.env.TEMPO_EDL_TOKEN || '' }
    });

    let out = '';
    let err = '';
    py.stdout.on('data', (d) => { out += d.toString(); });
    py.stderr.on('data', (d) => { err += d.toString(); });
    py.on('close', (code) => {
      if (code !== 0) {
        return res.status(500).json({ ok: false, error: 'parser_failed', details: err.trim() });
      }
      try {
        const json = JSON.parse(out);
        return res.json(json);
      } catch (e) {
        return res.status(500).json({ ok: false, error: 'invalid_parser_output', details: e.message });
      }
    });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
});

// TEMPO Forecast endpoint (placeholder for now)
app.get('/api/tempo/forecast', async (req, res) => {
  try {
    const { lat = '38.9', lon = '-77.0', hours = '72' } = req.query;
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&hourly=pm10,pm2_5,nitrogen_dioxide,ozone&timezone=auto`;
    const r = await fetch(url);
    if (!r.ok) return res.status(r.status).json({ error: 'upstream_error' });
    const data = await r.json();
    const n = Math.min(parseInt(hours, 10), data.hourly.time.length);
    return res.json({
      source: 'placeholder',
      time: data.hourly.time.slice(0, n),
      pm25: data.hourly.pm2_5.slice(0, n),
      pm10: data.hourly.pm10.slice(0, n),
      no2: data.hourly.nitrogen_dioxide.slice(0, n),
      o3: data.hourly.ozone.slice(0, n)
    });
  } catch (e) {
    return res.status(500).json({ error: 'server_error', details: e.message });
  }
});

const port = process.env.PORT || 8787;
app.listen(port, () => console.log(`TEMPO backend listening on :${port}`));


