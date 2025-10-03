import { useEffect, useState } from 'react';
import { loadJson, saveJson } from '../lib/storage';

export default function Profile() {
  const [profile, setProfile] = useState(() => loadJson('cs_live_profile', { name: '', email: '', age: '', condition: 'None', sensitivity: 'Medium' }));
  useEffect(() => { saveJson('cs_live_profile', profile); }, [profile]);
  const set = (key, value) => setProfile(prev => ({ ...prev, [key]: value }));
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="card-panel p-6">
        <h1 className="text-2xl font-extrabold mb-1">Your Profile</h1>
        <p className="text-slate-300 mb-6">Optional health info to personalize alerts</p>
        <form className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-300">Name</label>
            <input className="input mt-1" type="text" placeholder="Jane Doe" value={profile.name} onChange={(e) => set('name', e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-slate-300">Email</label>
            <input className="input mt-1" type="email" placeholder="you@example.com" value={profile.email} onChange={(e) => set('email', e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-slate-300">Age</label>
            <input className="input mt-1" type="number" placeholder="e.g. 28" value={profile.age} onChange={(e) => set('age', e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-slate-300">Conditions</label>
            <select className="input mt-1" value={profile.condition} onChange={(e) => set('condition', e.target.value)}>
              <option value="None">None</option>
              <option value="Asthma">Asthma</option>
              <option value="COPD">COPD</option>
              <option value="Heart Disease">Heart Disease</option>
              <option value="Allergies">Allergies</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-slate-300">Sensitivity</label>
            <div className="mt-2 flex gap-2">
              {['Low', 'Medium', 'High'].map(level => (
                <button
                  key={level}
                  type="button"
                  className={`btn-secondary ${profile.sensitivity === level ? 'border-accent-cyan text-accent-cyan' : ''}`}
                  onClick={() => set('sensitivity', level)}
                >{level}</button>
              ))}
            </div>
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button type="button" className="btn-primary" onClick={() => saveJson('cs_live_profile', profile)}>Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}


