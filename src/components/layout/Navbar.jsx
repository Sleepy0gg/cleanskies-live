import { Link, NavLink } from 'react-router-dom';
import { brand } from '../../lib/theme';
import { useAuth } from '../../lib/auth.jsx';
import { useUI } from '../../lib/uiProvider.jsx';

const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `px-3 py-2 rounded-lg transition ${
        isActive ? 'bg-white/10 text-accent-cyan' : 'hover:bg-white/5'
      }`
    }
  >
    {children}
  </NavLink>
);

export default function Navbar() {
  const { user, logout } = useAuth();
  const { sidebarOpen, setSidebarOpen } = useUI();
  return (
    <header className="sticky top-0 z-50 border-b border-white/10" style={{
      backgroundImage: 'linear-gradient(123.64deg, rgba(255,255,255,0) -22.38%, rgba(255,255,255,0.039) 70.38%)',
      backdropFilter: 'blur(12px)'
    }}>
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <button className="btn-secondary mr-2" aria-label="Toggle menu" onClick={() => setSidebarOpen(prev => !prev)}>☰</button>
        <Link to="/" className="flex items-center gap-3">
          <img src="/src/assets/logo.svg" alt="logo" className="h-8 w-8 drop-shadow animate-float" />
          <div className="leading-tight">
            <div className="text-slate-100 font-extrabold tracking-wide">{brand.name}</div>
            <div className="text-xs text-slate-300">{brand.tagline}</div>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="px-3 py-2 text-slate-300">Hi, {user.name || 'User'}</span>
              <button className="btn-secondary" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <NavItem to="/login">Login</NavItem>
              <NavItem to="/signup">Signup</NavItem>
            </>
          )}
        </div>
      </div>
    </header>
  );
}


