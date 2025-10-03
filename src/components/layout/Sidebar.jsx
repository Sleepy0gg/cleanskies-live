import { NavLink } from 'react-router-dom';
import { useAuth } from '../../lib/auth.jsx';
import { useTheme } from '../../lib/themeProvider.jsx';
import { useUI } from '../../lib/uiProvider.jsx';
import { brand } from '../../lib/theme.js';
import HomeIcon from '../../assets/icons/home.svg';
import PlanIcon from '../../assets/icons/plan.svg';
import InfoIcon from '../../assets/icons/info.svg';
import SettingsIcon from '../../assets/icons/settings.svg';

const Item = ({ to, label, iconSrc }) => {
  const { setSidebarOpen } = useUI();
  return (
    <NavLink
      to={to}
      onClick={() => setSidebarOpen(false)}
      className={({ isActive }) =>
        `group flex items-center gap-3 px-3 py-2 rounded-lg transition ${
          isActive ? 'bg-white/10 text-accent-cyan' : 'hover:bg-white/5 text-slate-200'
        }`
      }
    >
      <img src={iconSrc} alt="" className="h-5 w-5 opacity-80 group-hover:opacity-100 transition" />
      <span className="hidden md:inline">{label}</span>
    </NavLink>
  );
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { theme, setTheme, themes } = useTheme();
  const { sidebarOpen, setSidebarOpen } = useUI();

  const previewBg = (t) => ({
    'aurora': 'conic-gradient(from 200deg at 30% 10%, rgba(13,148,136,0.25), transparent 40%), radial-gradient(1200px 800px at 10% -10%, rgba(15,23,42,0.9), transparent), linear-gradient(180deg, #0b1222 0%, #0b1222 60%, #0a1020 100%)',
    'space-dust': 'radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,0.25) 50%, transparent 50%), radial-gradient(1px 1px at 80% 30%, rgba(255,255,255,0.2) 50%, transparent 50%), radial-gradient(1px 1px at 30% 80%, rgba(255,255,255,0.18) 50%, transparent 50%), radial-gradient(1px 1px at 60% 60%, rgba(255,255,255,0.22) 50%, transparent 50%), radial-gradient(1000px 700px at 80% 0%, rgba(236,72,153,0.15), transparent), linear-gradient(180deg, #070a14 0%, #0b1222 100%)',
    'storm': 'repeating-linear-gradient(135deg, rgba(148,163,184,0.1) 0 8px, transparent 8px 16px), radial-gradient(900px 700px at 0% 100%, rgba(59,130,246,0.12), transparent), linear-gradient(180deg, #0a0f1a 0%, #0c1426 100%)',
    'sunrise': 'conic-gradient(from 0deg at 50% 0%, rgba(251,191,36,0.18), transparent 60%), radial-gradient(1000px 700px at 0% 100%, rgba(244,114,182,0.15), transparent), linear-gradient(180deg, #130a1a 0%, #23123a 100%)'
  })[t] || 'linear-gradient(180deg, #0b1222 0%, #0a1020 100%)';

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      <aside
        className={`fixed left-0 top-0 h-full z-40 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="card-panel p-4 w-52 h-full flex flex-col bg-gradient-to-br from-vision-dark-blue to-vision-dark-purple backdrop-blur-xl border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <img src="/src/assets/logo.svg" alt="logo" className="h-8 w-8 drop-shadow animate-float" />
            <div className="leading-tight">
              <div className="text-slate-100 font-extrabold tracking-wide">{brand.name}</div>
              <div className="text-xs text-slate-300">{brand.tagline}</div>
            </div>
          </div>

          {user && (
            <div className="flex items-center gap-3 mb-6 p-3 bg-white/5 rounded-lg">
              <div className="h-8 w-8 rounded-full bg-accent-cyan flex items-center justify-center text-sm font-bold text-slate-900">
                {user.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <div>
                <div className="text-slate-100 font-semibold">{user.name || 'User'}</div>
                <button onClick={logout} className="text-xs text-slate-400 hover:text-accent-cyan transition">Logout</button>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2 mb-4">
            <Item to="/" label="Home" iconSrc={HomeIcon} />
            <Item to="/plan" label="Plan Trip" iconSrc={PlanIcon} />
            <Item to="/about" label="About" iconSrc={InfoIcon} />
            <Item to="/settings" label="Settings" iconSrc={SettingsIcon} />
          </div>

          <div className="h-px w-full bg-white/10 my-3" />
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-400 mb-2">Quick Theme</div>
            <div className="grid grid-cols-4 gap-2">
              {themes.map(t => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  title={t}
                  className={`h-8 rounded-md border ${theme === t ? 'border-accent-cyan' : 'border-white/10'}`}
                  style={{ background: previewBg(t), backgroundSize: 'cover' }}
                />
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}


