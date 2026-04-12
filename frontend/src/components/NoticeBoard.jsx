import { useState, useEffect } from 'react';

export default function NoticeBoard({ isAdmin = false }) {
  const [notices, setNotices] = useState([]);
  const [newNotice, setNewNotice] = useState('');

  const fetchNotices = () => {
    fetch('http://localhost:8000/notices')
      .then(res => res.json())
      .then(data => setNotices(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!newNotice.trim()) return;
    try {
      await fetch('http://localhost:8000/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newNotice })
      });
      setNewNotice('');
      fetchNotices();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:8000/notices/${id}`, { method: 'DELETE' });
      fetchNotices();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl shadow-xl border border-slate-700/50 p-6 max-h-96 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4 text-slate-100">Notice Board</h2>
      
      {isAdmin && (
        <form onSubmit={handlePost} className="mb-4">
          <textarea
            className="w-full p-2 bg-slate-900 border border-slate-700 rounded mb-2 text-sm text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none placeholder-slate-500"
            placeholder="Type a new notice here..."
            value={newNotice}
            onChange={e => setNewNotice(e.target.value)}
            rows="2"
            required
          ></textarea>
          <button type="submit" className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-full font-semibold hover:bg-indigo-700 transition">
            Post Notice
          </button>
        </form>
      )}

      {notices.length === 0 ? (
        <p className="text-slate-500 italic">No recent notices.</p>
      ) : (
        <div className="overflow-hidden relative h-64">
          <ul className="space-y-4 animate-scroll-vertical absolute w-full">
            {[...notices, ...notices].map((notice, idx) => (
              <li key={`${notice.id}-${idx}`} className="border-l-4 border-indigo-500 pl-4 py-3 bg-slate-900/50 rounded-r flex justify-between items-start backdrop-blur-sm">
                <div>
                  <p className="text-slate-200 text-sm whitespace-pre-wrap">{notice.content}</p>
                  <small className="text-slate-500 text-xs">{new Date(notice.created_at).toLocaleString()}</small>
                </div>
                {isAdmin && (
                  <button onClick={() => handleDelete(notice.id)} className="text-red-400 hover:text-red-300 text-xs font-semibold ml-2 shrink-0">
                    Delete
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
