import { useState, useEffect } from 'react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ user_id: '', name: '', password: '', contact_number: '' });
  const [message, setMessage] = useState('');

  const fetchUsers = () => {
    fetch('http://localhost:8000/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Failed to create user. Register Number may already exist.');
      setMessage('User registered successfully!');
      setForm({ user_id: '', name: '', password: '', contact_number: '' });
      fetchUsers();
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in flex flex-col md:flex-row gap-8">
      <div className="flex-1 bg-slate-800 p-6 rounded-xl shadow-xl border border-slate-700/50">
        <h2 className="text-2xl font-bold mb-4 text-slate-100">Add New User</h2>
        {message && <div className="mb-4 p-3 bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">{message}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
            <input 
              type="text" 
              required
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              className="w-full p-2 bg-slate-900 border border-slate-700 rounded text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Register Number</label>
            <input 
              type="text" 
              required
              value={form.user_id}
              onChange={e => setForm({...form, user_id: e.target.value})}
              className="w-full p-2 bg-slate-900 border border-slate-700 rounded text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
            <input 
              type="password" 
              required
              value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
              className="w-full p-2 bg-slate-900 border border-slate-700 rounded text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Contact Number</label>
            <input 
              type="text" 
              required
              value={form.contact_number}
              onChange={e => setForm({...form, contact_number: e.target.value})}
              className="w-full p-2 bg-slate-900 border border-slate-700 rounded text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <button type="submit" className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full text-white font-semibold flex items-center justify-center hover:shadow-lg hover:opacity-90 transition">
            Register User
          </button>
        </form>
      </div>

      <div className="flex-[2] bg-slate-800 p-6 rounded-xl shadow-xl border border-slate-700/50">
        <h2 className="text-2xl font-bold mb-4 text-slate-100">Existing Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900 text-slate-400 text-sm uppercase tracking-wider">
                <th className="p-4 rounded-tl-lg">ID Number</th>
                <th className="p-4">Name</th>
                <th className="p-4 rounded-tr-lg">Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-750">
                  <td className="p-4 font-mono text-sm text-slate-200">{u.user_id}</td>
                  <td className="p-4 text-slate-200 font-medium">{u.name}</td>
                  <td className="p-4 text-slate-400 text-sm">{u.contact_number}</td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="3" className="p-8 text-center text-slate-500">No users registered.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
