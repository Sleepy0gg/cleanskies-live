import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../lib/auth.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    login({ name: email.split('@')[0] || 'User', email });
    navigate('/');
  };
  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="card-panel p-6">
        <h1 className="text-2xl font-extrabold mb-1">Welcome back</h1>
        <p className="text-slate-300 mb-6">Sign in to continue</p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm text-slate-300">Email</label>
            <input className="input mt-1" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm text-slate-300">Password</label>
            <input className="input mt-1" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn-primary w-full">Sign In</button>
        </form>
        <div className="text-sm text-slate-300 mt-4">
          No account? <Link className="text-accent-cyan" to="/signup">Create one</Link>
        </div>
      </div>
    </div>
  );
}


