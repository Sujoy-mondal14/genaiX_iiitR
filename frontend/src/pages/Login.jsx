import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, password })
      });
      if (!res.ok) throw new Error('Invalid credentials');
      const data = await res.json();
      localStorage.setItem('user', JSON.stringify(data));
      navigate(data.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-slate-800 p-8 rounded-xl shadow-xl border border-slate-700/50">
      <h2 className="text-2xl font-bold text-center text-slate-100 mb-6">Sign In</h2>
      {error && <div className="bg-red-500/20 text-red-400 p-3 rounded border border-red-500/30 mb-4">{error}</div>}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">User ID</label>
          <input 
            type="text" 
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full p-3 bg-slate-900 border border-slate-700 rounded text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none placeholder-slate-500"
            placeholder="e.g. 2025ug1007 or admin"
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-slate-900 border border-slate-700 rounded text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none placeholder-slate-500"
            placeholder="••••••••"
            required 
          />
        </div>
        <button type="submit" className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold flex items-center justify-center hover:shadow-lg hover:opacity-90 transition py-3 rounded-full shadow">
          Login
        </button>
      </form>
    </div>
  );
}
