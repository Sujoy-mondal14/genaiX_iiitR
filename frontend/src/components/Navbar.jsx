import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-800 shadow-xl">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-xl font-bold text-indigo-400 tracking-wide">
            IIITRanchi Grievance Portal
          </Link>
          <div className="flex gap-4 items-center">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <>
                    <Link to="/admin/workers" className="text-slate-300 hover:text-indigo-400 font-medium transition">Manage Workers</Link>
                    <Link to="/admin/users" className="text-slate-300 hover:text-indigo-400 font-medium transition">Manage Students</Link>
                  </>
                )}
                <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="text-slate-300 hover:text-indigo-400 font-medium transition">
                  {user.role === 'admin' ? 'Pending Issues' : 'My Issues'}
                </Link>
                <button onClick={handleLogout} className="px-5 py-2 rounded-full bg-red-500/20 text-red-400 font-semibold shadow hover:bg-red-500/30 transition">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="px-5 py-2 rounded-full bg-indigo-600 text-white font-semibold shadow-lg hover:bg-indigo-700 transition">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
