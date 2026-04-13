import { useState, useEffect } from 'react';
import NoticeBoard from '../components/NoticeBoard';
import { API_BASE_URL } from '../config';

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [issues, setIssues] = useState([]);
  const [form, setForm] = useState({ description: '', type_override: '', image_url: null });
  const [showOther, setShowOther] = useState(false);
  const [message, setMessage] = useState('');
  const [reviewModal, setReviewModal] = useState({ open: false, issueId: null, rating: 5, comment: '' });

  const fetchIssues = () => {
    fetch(`${API_BASE_URL}/issues/my/${user.user_id}`)
      .then(res => res.json())
      .then(data => setIssues(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Submitting... Analyzing with AI...');
    try {
      const res = await fetch(`${API_BASE_URL}/issues`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.user_id,
          description: form.description,
          type_override: form.type_override || null,
          image_url: form.image_url
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Error submitting');
      setMessage(`Success! Tracking ID: ${data.tracking_id}`);
      setForm({ description: '', type_override: '', image_url: null });
      document.getElementById('image-upload').value = ""; // clear file input
      fetchIssues(); // refresh
    } catch (err) {
      setMessage(`Failed: ${err.message}`);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/issues/${reviewModal.issueId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: reviewModal.rating, comment: reviewModal.comment })
      });
      if(!res.ok) throw new Error('Failed to submit review');
      fetchIssues();
      setReviewModal({ open: false, issueId: null, rating: 5, comment: '' });
      setMessage('Review submitted successfully!');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in relative">
      <div className="mb-8">
        <NoticeBoard />
      </div>

      {reviewModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-800 p-6 rounded-xl shadow-xl border border-slate-700 max-w-sm w-full">
            <h3 className="text-xl font-bold text-slate-100 mb-4">Rate Service</h3>
            <form onSubmit={submitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Rating (1-5 Stars)</label>
                <select value={reviewModal.rating} onChange={e => setReviewModal({...reviewModal, rating: parseInt(e.target.value)})} className="w-full p-2 bg-slate-900 border border-slate-700 rounded text-slate-100">
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Stars</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Feedback (Optional)</label>
                <textarea value={reviewModal.comment} onChange={e => setReviewModal({...reviewModal, comment: e.target.value})} className="w-full p-2 bg-slate-900 border border-slate-700 rounded text-slate-100" rows="3"></textarea>
              </div>
              <div className="flex gap-2 justify-end mt-4">
                <button type="button" onClick={() => setReviewModal({open: false, issueId: null, rating: 5, comment: ''})} className="px-4 py-2 text-slate-400 hover:text-slate-200">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-slate-800 p-6 rounded-xl shadow-xl border border-slate-700/50">
        <h2 className="text-2xl font-bold mb-4 text-slate-100">Submit a New Issue</h2>
        {message && <div className="mb-4 p-3 bg-blue-500/20 text-blue-300 rounded border border-blue-500/30">{message}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Register Number</label>
              <input type="text" value={user.user_id} disabled className="w-full p-2 bg-slate-900 border border-slate-700 rounded text-slate-500 cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
              <input type="text" value={user.name} disabled className="w-full p-2 bg-slate-900 border border-slate-700 rounded text-slate-500 cursor-not-allowed" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Issue Category</label>
            <select 
              className="w-full p-2 bg-slate-900 border border-slate-700 rounded text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
              onChange={(e) => {
                const val = e.target.value;
                setShowOther(val === 'Other');
                if(val !== 'Other') setForm({...form, type_override: val});
                else setForm({...form, type_override: ''});
              }}
            >
              <option value="">-- Let AI Decide / Auto-Classify --</option>
              <option value="Bathroom & Hygiene">Bathroom & Hygiene</option>
              <option value="Anti-Ragging & Safety">Anti-Ragging & Safety</option>
              <option value="Mess & Food Quality">Mess & Food Quality</option>
              <option value="Academic Issues">Academic Issues</option>
              <option value="Infrastructure/Maintenance">Infrastructure/Maintenance</option>
              <option value="Other">Other (Specify)</option>
            </select>
          </div>
          {showOther && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Specify Other Issue</label>
              <input 
                type="text" 
                value={form.type_override}
                onChange={e => setForm({...form, type_override: e.target.value})}
                className="w-full p-2 bg-slate-900 border border-slate-700 rounded text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
            <textarea 
              rows="4"
              className="w-full p-2 bg-slate-900 border border-slate-700 rounded text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none placeholder-slate-500"
              value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
              required
              placeholder="Describe the issue in detail..."
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Optional Image Upload</label>
            <input 
              id="image-upload"
              type="file" 
              accept="image/*"
              className="w-full p-2 bg-slate-900 border border-slate-700 rounded text-slate-300 focus:outline-none"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => setForm({...form, image_url: reader.result});
                  reader.readAsDataURL(file);
                } else {
                  setForm({...form, image_url: null});
                }
              }}
            />
          </div>
          <button type="submit" className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full text-white font-semibold flex items-center justify-center hover:shadow-lg hover:opacity-90 transition">
            Submit Issue
          </button>
        </form>
      </div>

      <div className="bg-slate-800 p-6 rounded-xl shadow-xl border border-slate-700/50">
        <h2 className="text-2xl font-bold mb-4 text-slate-100">My Issues</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-700 text-sm text-slate-400 uppercase tracking-wider">
                <th className="p-3 rounded-tl-lg">Tracking ID</th>
                <th className="p-3">Type</th>
                <th className="p-3">Status</th>
                <th className="p-3">Assigned Worker</th>
                <th className="p-3">Timeline</th>
                <th className="p-3 rounded-tr-lg">Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {issues.map(iss => (
                <tr key={iss.id} className="hover:bg-slate-750">
                  <td className="p-3 font-medium text-slate-200">{iss.tracking_id}</td>
                  <td className="p-3 text-slate-300">{iss.type}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${iss.status === 'Submitted' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' : 
                        iss.status === 'Assigned' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-green-500/20 text-green-300 border border-green-500/30'}`}>
                      {iss.status}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400">{iss.assigned_worker || '-'}</td>
                  <td className="p-3 text-slate-400 text-xs">
                    <div>Raised: {new Date(iss.created_at).toLocaleDateString()}</div>
                    {iss.resolved_at && <div className="text-green-400 mt-1">Resolved: {new Date(iss.resolved_at).toLocaleDateString()}</div>}
                  </td>
                  <td className="p-3">
                    {iss.status === 'Resolved' && !iss.review && (
                      <button onClick={() => setReviewModal({open: true, issueId: iss.id, rating: 5, comment: ''})} className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-1 rounded hover:bg-indigo-500/40">
                        Rate
                      </button>
                    )}
                    {iss.review && (
                      <span className="text-xs text-yellow-500 font-bold flex items-center gap-1">
                        ★ {iss.review.rating}/5
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {issues.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-slate-500">No issues submitted yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
