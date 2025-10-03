export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="card-panel p-6">
        <h1 className="text-2xl font-extrabold mb-2">About CleanSkies Live</h1>
        <p className="text-slate-300 mb-4">CleanSkies Live helps people make healthier, lower-emission choices by visualizing air quality, surfacing guidance, and planning routes that avoid hotspots.</p>
        <div className="h-px w-full bg-white/10 my-4" />
        <h2 className="text-lg font-bold mb-2">Purpose</h2>
        <p className="text-slate-300 mb-4">Empower everyday decisions—whether going for a run, biking to work, or selecting a school route—by combining local sensors and satellite data into clear insights.</p>
        <h2 className="text-lg font-bold mb-2">Who it’s for</h2>
        <ul className="list-disc pl-6 text-slate-300 mb-4">
          <li>People with sensitivities (asthma, COPD, allergies)</li>
          <li>Commuters choosing cleaner, safer routes</li>
          <li>Communities tracking neighborhood air quality</li>
        </ul>
        <div className="h-px w-full bg-white/10 my-4" />
        <h2 className="text-lg font-bold mb-2">Features</h2>
        <ul className="list-disc pl-6 text-slate-300 mb-4">
          <li>Live AQI tiles and forecast chart</li>
          <li>Map with hotspots and geolocation</li>
          <li>Personalized profile and recommendations</li>
          <li>Route planner that avoids congested hotspots</li>
        </ul>
        <div className="h-px w-full bg-white/10 my-4" />
        <h2 className="text-lg font-bold mb-2">Air Quality Basics (Plain English)</h2>
        <div className="space-y-3 text-slate-300">
          <div>
            <div className="font-semibold">What is AQI?</div>
            <p>The Air Quality Index is a simple 0–500 score. Lower is better, higher is worse.</p>
            <ul className="text-sm mt-2 space-y-1">
              <li><span className="inline-block w-3 h-3 rounded-full align-middle mr-2" style={{background:'#00E400'}} /> 0–50: Good — air is clean.</li>
              <li><span className="inline-block w-3 h-3 rounded-full align-middle mr-2" style={{background:'#FFFF00'}} /> 51–100: Moderate — okay for most; sensitive groups watch symptoms.</li>
              <li><span className="inline-block w-3 h-3 rounded-full align-middle mr-2" style={{background:'#FF8C00'}} /> 101–150: Unhealthy for sensitive groups.</li>
              <li><span className="inline-block w-3 h-3 rounded-full align-middle mr-2" style={{background:'#FF0000'}} /> 151–200: Unhealthy — consider limiting outdoor activity.</li>
              <li><span className="inline-block w-3 h-3 rounded-full align-middle mr-2" style={{background:'#8F3F97'}} /> 201–300: Very Unhealthy.</li>
              <li><span className="inline-block w-3 h-3 rounded-full align-middle mr-2" style={{background:'#7E0023'}} /> 301+: Hazardous.</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold">What are PM2.5 and PM10?</div>
            <p>They are tiny particles in the air. PM2.5 are very small (like smoke), PM10 are a bit larger (like dust). Less is better.</p>
          </div>
          <div>
            <div className="font-semibold">O₃, NO₂, SO₂, CO</div>
            <p>These are gases from traffic, industry, and sunlight reactions. High levels can irritate lungs and eyes.</p>
          </div>
          <div>
            <div className="font-semibold">How can I reduce exposure?</div>
            <ul className="list-disc pl-6 text-sm space-y-1">
              <li>Choose times/routes with lower AQI (the app helps).</li>
              <li>Close windows during peaks; use clean filters.</li>
              <li>Consider a mask on high-AQI days, especially if sensitive.</li>
            </ul>
          </div>
        </div>
        <p className="text-slate-400 text-sm mt-6">This is a UI prototype using mock data. Swap the API layer with real sources to go live.</p>
      </div>
    </div>
  );
}


