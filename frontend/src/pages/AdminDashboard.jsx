import { useState, useEffect } from 'react';
import NoticeBoard from '../components/NoticeBoard';
import { API_BASE_URL } from '../config';

export default function AdminDashboard() {
  const [issues, setIssues] = useState([]);
  const [resolvedIssues, setResolvedIssues] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [message, setMessage] = useState('');
  const [modalImage, setModalImage] = useState(null);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'resolved'

  const fetchIssues = () => {
    fetch(`${API_BASE_URL}/issues/pending`)
      .then(res => res.json())
      .then(data => setIssues(data))
      .catch(err => console.error(err));
      
    fetch(`${API_BASE_URL}/issues/resolved`)
      .then(res => res.json())
      .then(data => setResolvedIssues(data))
      .catch(err => console.error(err));
  };

  const fetchWorkers = () => {
    fetch(`${API_BASE_URL}/workers/available`)
      .then(res => res.json())
      .then(data => setWorkers(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchIssues();
    fetchWorkers();
  }, []);

  const assignWorker = async (issueId, workerId) => {
    if(!workerId) return;
    try {
      const res = await fetch(`${API_BASE_URL}/issues/${issueId}/assign?worker_id=${workerId}`, { method: 'POST' });
      if(!res.ok) throw new Error('Failed to assign');
      setMessage('Worker assigned successfully');
      fetchIssues(); // Refresh list
      fetchWorkers(); // Refresh available workers
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  const updateStatus = async (issueId, status) => {
    try {
      const res = await fetch(`${API_BASE_URL}/issues/${issueId}/status?status=${status}`, { method: 'POST' });
      if(!res.ok) throw new Error('Failed to update status');
      setMessage(`Status updated to ${status}`);
      fetchIssues();
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Admin Control Center</h2>
      </div>
      
      <NoticeBoard isAdmin={true} />

      {message && <div className="p-3 bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">{message}</div>}

      {/* Image Modal */}
      {modalImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setModalImage(null)}>
          <div className="relative max-w-4xl w-full">
            <button onClick={() => setModalImage(null)} className="absolute -top-10 right-0 text-white hover:text-gray-300 font-bold text-xl">&times; Close</button>
            <img src={modalImage} alt="Fullscreen Preview" className="w-full h-auto rounded-xl shadow-2xl" onClick={e => e.stopPropagation()} />
          </div>
        </div>
      )}
      
      <div className="bg-slate-800 shadow-xl rounded-xl overflow-hidden border border-slate-700/50">
        <div className="flex bg-slate-900 border-b border-slate-700">
          <button 
            className={`flex-1 py-4 text-center font-semibold transition ${activeTab === 'pending' ? 'text-indigo-400 border-b-2 border-indigo-400 bg-slate-800/50' : 'text-slate-400 hover:text-slate-200'}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending Issues
            {issues.filter(i => i.status === 'Submitted').length > 0 && (
              <span className="ml-2 inline-flex relative h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            )}
          </button>
          <button 
            className={`flex-1 py-4 text-center font-semibold transition ${activeTab === 'resolved' ? 'text-indigo-400 border-b-2 border-indigo-400 bg-slate-800/50' : 'text-slate-400 hover:text-slate-200'}`}
            onClick={() => setActiveTab('resolved')}
          >
            Resolved & Reviews
          </button>
        </div>

        {activeTab === 'pending' ? (
          <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-700 text-sm text-slate-400 uppercase tracking-wider">
                <th className="p-4 rounded-tl-lg">Tracking ID</th>
                <th className="p-4 w-1/3">Issue & Description</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Assign Worker</th>
                <th className="p-4 rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {issues.map(iss => (
                <tr key={iss.id} className="hover:bg-slate-750">
                  <td className="p-4 font-mono text-sm text-slate-200">{iss.tracking_id}</td>
                  <td className="p-4">
                    <p className="font-semibold text-slate-100">{iss.type}</p>
                    <p className="text-sm text-slate-300 line-clamp-2 mb-2">{iss.description}</p>
                    {iss.image_url && <img src={iss.image_url} alt="Problem Preview" className="w-16 h-16 object-cover rounded cursor-pointer border border-gray-200 hover:opacity-80 transition" onClick={() => setModalImage(iss.image_url)} />}
                    <p className="text-xs text-slate-400 mt-2">By: {iss.user}</p>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-bold rounded-full border
                      ${iss.priority === 'High' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 
                        iss.priority === 'Medium' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' : 'bg-slate-700 text-slate-300 border-slate-600'}`}>
                      {iss.priority}
                    </span>
                  </td>
                  <td className="p-4">
                    {iss.status === 'Submitted' ? (
                      <select 
                        onChange={(e) => assignWorker(iss.id, e.target.value)}
                        className="p-1 text-sm border border-slate-700 rounded bg-slate-900 text-slate-200 w-full max-w-[150px] shadow-sm outline-none focus:ring-1 focus:ring-indigo-500"
                        defaultValue=""
                      >
                        <option value="" disabled>Select Worker</option>
                        {workers.map(w => (
                          <option key={w.id} value={w.id}>{w.name} ({w.profession})</option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-sm text-slate-400 bg-slate-900 border border-slate-700 px-2 py-1 rounded">Assigned</span>
                    )}
                  </td>
                  <td className="p-4 flex gap-2">
                    <button onClick={() => updateStatus(iss.id, 'Resolved')} className="text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1.5 rounded-full hover:bg-green-500/30 transition">Resolve</button>
                    <button onClick={() => updateStatus(iss.id, 'Deleted')} className="text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-full hover:bg-red-500/30 transition">Delete</button>
                  </td>
                </tr>
              ))}
              {issues.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500 font-medium">✨ All caught up! No pending issues.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-700 text-sm text-slate-400 uppercase tracking-wider">
                <th className="p-4">Tracking ID</th>
                <th className="p-4 w-1/3">Issue Details</th>
                <th className="p-4">Timestamps</th>
                <th className="p-4">Student Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {resolvedIssues.map(iss => (
                <tr key={iss.id} className="hover:bg-slate-750">
                  <td className="p-4 font-mono text-sm text-slate-200">{iss.tracking_id}</td>
                  <td className="p-4">
                    <p className="font-semibold text-slate-100">{iss.type}</p>
                    <p className="text-sm text-slate-300 line-clamp-2">{iss.description}</p>
                    <p className="text-xs text-slate-400 mt-2">By: {iss.user}</p>
                  </td>
                  <td className="p-4 text-xs text-slate-400">
                    <div>Resolved: <span className="text-slate-200">{new Date(iss.resolved_at).toLocaleDateString()}</span></div>
                  </td>
                  <td className="p-4">
                    {iss.review ? (
                      <div className="bg-slate-900/50 p-2 rounded border border-slate-700">
                        <div className="text-yellow-500 font-bold mb-1">★ {iss.review.rating}/5</div>
                        {iss.review.comment && <p className="text-xs text-slate-300 italic">"{iss.review.comment}"</p>}
                      </div>
                    ) : (
                      <span className="text-slate-500 text-xs italic">Pending User Review</span>
                    )}
                  </td>
                </tr>
              ))}
              {resolvedIssues.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-slate-500 font-medium">No resolved issues found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </div>
  );
}
