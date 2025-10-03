# CleanSkies Deployment Guide

## Required APIs

### 1. Weather Data - OpenWeatherMap API ✅ CONFIGURED
- **Website**: https://openweathermap.org/api
- **Free Tier**: 1,000 calls/day
- **Cost**: Free
- **Your Key**: `82cd502be3712b688d6bb6b0284864ac` ✅

### 2. Air Quality Data - AirVisual API (IQAir)
- **Website**: https://www.iqair.com/air-pollution-data-api
- **Free Tier**: 1,000 calls/month
- **Cost**: Free
- **Setup**:
  1. Sign up at iqair.com
  2. Go to API section
  3. Generate your API key
  4. Add to environment variables as `VITE_AIRVISUAL_API_KEY`

### 3. Route Planning - OpenRouteService API
- **Website**: https://openrouteservice.org/dev/#/signup
- **Free Tier**: 2,500 requests/day
- **Cost**: Free
- **Setup**:
  1. Sign up at openrouteservice.org
  2. Get your API key
  3. Add to environment variables as `VITE_OPENROUTE_API_KEY`

### 4. NASA TEMPO Satellite Data ✅ INTEGRATED
- **Website**: https://tempo.sat.umd.edu/
- **Free Tier**: Unlimited
- **Cost**: FREE
- **Features**: Real-time atmospheric monitoring from space
- **Data**: NO₂, O₃, Aerosol Index, Cloud Cover, Pollution Hotspots
- **Setup**: No API key required! 🚀

## Environment Variables

Create a `.env` file in the project root:

```env
# OpenWeatherMap API (Already configured!)
VITE_OPENWEATHER_API_KEY=82cd502be3712b688d6bb6b0284864ac

# AirVisual API (Get from iqair.com)
VITE_AIRVISUAL_API_KEY=your_airvisual_api_key_here

# OpenRouteService API (Get from openrouteservice.org)
VITE_OPENROUTE_API_KEY=your_openroute_api_key_here

# NASA TEMPO (No key required - already integrated!)
# TEMPO data is automatically fetched from NASA satellites
```

## Deployment Platforms

### Recommended: Vercel (Free)
1. Push code to GitHub
2. Connect GitHub repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Alternative: Netlify (Free)
1. Connect GitHub repo to Netlify
2. Add environment variables in Netlify dashboard
3. Deploy automatically

### Alternative: Railway (Free tier available)
1. Connect GitHub repo to Railway
2. Add environment variables
3. Deploy automatically

## Build Commands

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview build locally
npm run preview
```

## Features Included

✅ **Real-time Air Quality Data**
✅ **Weather Information**
✅ **Interactive Maps**
✅ **Route Planning with Pollution Avoidance**
✅ **Responsive Design**
✅ **Theme Switching**
✅ **User Preferences**
✅ **Loading States**
✅ **Error Handling**
✅ **Offline Fallback**

## API Limits & Costs

| Service | Free Tier | Paid Plans |
|---------|-----------|------------|
| OpenWeatherMap | 1,000 calls/day | $40/month for 1M calls |
| AirVisual | 1,000 calls/month | $99/month for 10K calls |
| OpenRouteService | 2,500 requests/day | €49/month for 100K requests |

## Performance Optimizations

- Lazy loading for components
- Image optimization
- API response caching
- Bundle splitting
- Service worker for offline support

## Security Notes

- API keys are client-side (normal for weather apps)
- No sensitive data stored
- HTTPS required for geolocation
- CORS properly configured
