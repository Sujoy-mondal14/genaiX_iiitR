import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NoticeBoard from '../components/NoticeBoard';
import { API_BASE_URL } from '../config';

export default function Home() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [stats, setStats] = useState({ raised_24h: 0, resolved_24h: 0, success_rate: 0 });

  useEffect(() => {
    fetch(`${API_BASE_URL}/stats`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(console.error);

    if (user) {
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="animate-fade-in flex flex-col md:flex-row gap-8">
      {user ? (
        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome back, {user.name}!</h1>
          <p className="text-lg text-gray-600 mb-8 max-w-lg">
            Stay updated with the latest campus announcements on the Notice Board, or proceed to your dashboard to manage issues.
          </p>
          <div>
            <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-full shadow hover:shadow-lg transition inline-block">
              {user.role === 'admin' ? 'Manage Pending Issues' : 'Go to My Issues'}
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-100 mb-6 leading-tight">
            Campus Problems? <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
              Resolved by AI.
            </span>
          </h1>
          <p className="text-lg text-slate-300 mb-8 max-w-lg">
            Welcome to the IIITRanchi Grievance Portal. Submit your concerns, and our AI-powered system will securely classify, prioritize, and assign them to the right personnel instantly.
          </p>
          <div className="mb-8">
            <Link to="/login" className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition text-lg inline-block">
              Get Started
            </Link>
          </div>
          
          <div className="bg-slate-800/80 p-6 rounded-xl border border-slate-700/50 shadow-inner max-w-lg">
            <h3 className="text-lg font-semibold text-slate-200 mb-4 tracking-wide text-center">Global Platform Activity (Last 24 Hours)</h3>
            <div className="flex items-end justify-around h-32 gap-6 relative px-4">
              {/* Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
                <div className="border-b border-slate-400 w-full"></div>
                <div className="border-b border-slate-400 w-full"></div>
                <div className="border-b border-slate-400 w-full mb-6"></div>
              </div>

              {/* Bar 1 */}
              <div className="flex flex-col items-center justify-end h-full z-10 w-1/3 group">
                <span className="text-indigo-400 font-bold mb-2 group-hover:-translate-y-1 transition text-sm">{stats.raised_24h}</span>
                <div className="w-full bg-gradient-to-t from-indigo-900 to-indigo-500 rounded-t-md shadow-lg transition-all duration-1000" style={{ height: `${Math.max((stats.raised_24h / (Math.max(stats.raised_24h, stats.resolved_24h, 1) * 1.2)) * 100, 5)}%` }}></div>
                <div className="text-xs text-slate-400 mt-2 font-medium w-max">Cases Raised</div>
              </div>

              {/* Bar 2 */}
              <div className="flex flex-col items-center justify-end h-full z-10 w-1/3 group">
                <span className="text-green-400 font-bold mb-2 group-hover:-translate-y-1 transition text-sm">{stats.resolved_24h}</span>
                <div className="w-full bg-gradient-to-t from-green-900 to-green-500 rounded-t-md shadow-lg transition-all duration-1000" style={{ height: `${Math.max((stats.resolved_24h / (Math.max(stats.raised_24h, stats.resolved_24h, 1) * 1.2)) * 100, 5)}%` }}></div>
                <div className="text-xs text-slate-400 mt-2 font-medium w-max">Cases Resolved</div>
              </div>

              {/* Bar 3 */}
              <div className="flex flex-col items-center justify-end h-full z-10 w-1/3 group">
                <span className="text-purple-400 font-bold mb-2 group-hover:-translate-y-1 transition text-sm">{stats.success_rate}%</span>
                <div className="w-full bg-gradient-to-t from-purple-900 to-purple-500 rounded-t-md shadow-lg transition-all duration-1000" style={{ height: `${Math.max(stats.success_rate, 5)}%` }}></div>
                <div className="text-xs text-slate-400 mt-2 font-medium w-max">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex-1 mt-8 md:mt-0">
        <NoticeBoard />
      </div>
    </div>
  );
}
