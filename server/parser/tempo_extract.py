import os
import sys
import json
import argparse
from datetime import datetime

try:
    import xarray as xr
    import numpy as np
    import fsspec  # for S3/HTTP with creds
except Exception as e:
    print(json.dumps({"ok": False, "error": "missing_python_deps", "details": str(e)}))
    sys.exit(1)


def parse_bbox(bbox_str):
    parts = [p.strip() for p in bbox_str.split(',')]
    if len(parts) != 4:
        raise ValueError('bbox must be minLon,minLat,maxLon,maxLat')
    return tuple(map(float, parts))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--granule-url', required=True)
    parser.add_argument('--bbox', required=True)
    parser.add_argument('--vars', default='no2,o3')
    args = parser.parse_args()

    token = os.environ.get('TEMPO_EDL_TOKEN', '').strip()
    if not token:
        print(json.dumps({"ok": False, "error": "no_token"}))
        sys.exit(2)

    min_lon, min_lat, max_lon, max_lat = parse_bbox(args.bbox)

    url = args.granule_url

    # Open dataset from HTTPS (with Bearer) or S3 (with temp creds)
    ds = None
    if url.startswith('s3://'):
        # Expect AWS creds in env (from Earthdata S3 credentials)
        s3_opts = {
            "key": os.environ.get('AWS_ACCESS_KEY_ID', ''),
            "secret": os.environ.get('AWS_SECRET_ACCESS_KEY', ''),
            "token": os.environ.get('AWS_SESSION_TOKEN', ''),
            "client_kwargs": {"region_name": os.environ.get('AWS_REGION', 'us-west-2')}
        }
        try:
            of = fsspec.open(url, mode='rb', **{"s3": s3_opts})
        except TypeError:
            # Older fsspec/s3fs signature
            of = fsspec.open(url, mode='rb', **{"storage_options": s3_opts})
        with of as f:
            ds = xr.open_dataset(f, engine='h5netcdf')
    else:
        # HTTPS with Authorization header
        backend_kwargs = { 'headers': { 'Authorization': f'Bearer {token}' } }
        try:
            ds = xr.open_dataset(url, engine='h5netcdf', backend_kwargs=backend_kwargs)
        except Exception:
            ds = xr.open_dataset(url, engine='netcdf4')

    # Select intended variable name (example for NO2 tropospheric column variable naming)
    requested = [s.strip().lower() for s in args.vars.split(',') if s.strip()]
    var_map = {
        'no2': ['nitrogendioxide_tropospheric_column','no2_tropospheric_column','NO2_TROPOSPHERIC_COLUMN'],
        'o3': ['ozone_tropospheric_column','o3_tropospheric_column','O3_TROPOSPHERIC_COLUMN'],
    }
    selected_vars = {}
    for key in requested:
        cands = var_map.get(key, [])
        found = None
        for v in cands:
            if v in ds.variables:
                found = v
                break
        if found is not None:
            selected_vars[key] = ds[found]
    if not selected_vars:
        print(json.dumps({"ok": False, "error": "vars_not_found", "requested": requested, "available": list(ds.variables)}))
        sys.exit(3)

    # Get geolocation variables (names may differ per product)
    lat_name = 'latitude' if 'latitude' in ds.variables else 'lat'
    lon_name = 'longitude' if 'longitude' in ds.variables else 'lon'
    if lat_name not in ds.variables or lon_name not in ds.variables:
        print(json.dumps({"ok": False, "error": "latlon_not_found", "available": list(ds.variables)}))
        sys.exit(4)

    lats = ds[lat_name].values
    lons = ds[lon_name].values
    # We’ll compute a grid per variable and return a dict of layers
    layers = {}

    # Mask invalid values if a QA variable exists (simplified)
    qa_name_candidates = ['qa_value', 'quality_flag']
    qa = None
    for q in qa_name_candidates:
        if q in ds.variables:
            qa = ds[q].values
            break

    # Grid definition (simple regular grid over bbox)
    res = 0.05  # ~5 km
    grid_lons = np.arange(min_lon, max_lon + res, res)
    grid_lats = np.arange(min_lat, max_lat + res, res)
    def bin_to_grid(vals):
        grid = np.full((grid_lats.size, grid_lons.size), np.nan, dtype=float)
        flat_vals = vals.reshape(-1)
        # optional QA mask
        if qa is not None:
            flat_qa = qa.reshape(-1)
            flat_vals = np.where((flat_qa >= 0.5) & np.isfinite(flat_vals), flat_vals, np.nan)

        # bbox filter
        flat_lats = lats.reshape(-1)
        flat_lons = lons.reshape(-1)
        m = (flat_lons >= min_lon) & (flat_lons <= max_lon) & (flat_lats >= min_lat) & (flat_lats <= max_lat)
        flat_lats = flat_lats[m]
        flat_lons = flat_lons[m]
        flat_vals = flat_vals[m]

        if flat_vals.size == 0:
            return grid

        lon_idx = np.clip(((flat_lons - min_lon) / res).astype(int), 0, grid_lons.size - 1)
        lat_idx = np.clip(((flat_lats - min_lat) / res).astype(int), 0, grid_lats.size - 1)

        counts = np.zeros_like(grid)
        for v, i, j in zip(flat_vals, lat_idx, lon_idx):
            if np.isfinite(v):
                if np.isnan(grid[i, j]):
                    grid[i, j] = v
                    counts[i, j] = 1
                else:
                    grid[i, j] = (grid[i, j] * counts[i, j] + v) / (counts[i, j] + 1)
                    counts[i, j] += 1
        return grid

    for key, da in selected_vars.items():
        layers[key] = bin_to_grid(da.values)

    out = {
        "ok": True,
        "timestamp": datetime.utcnow().isoformat() + 'Z',
        "bbox": [min_lon, min_lat, max_lon, max_lat],
        "lon": grid_lons.tolist(),
        "lat": grid_lats.tolist(),
        "values": layers,
    }
    print(json.dumps(out))


if __name__ == '__main__':
    main()


