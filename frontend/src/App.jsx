import { useState, useEffect } from 'react';
import axios from 'axios';
import { INDIAN_STATES } from './constants';

const API_URL = 'http://localhost:5000/api/users';

function App() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState([]);

  const [formData, setFormData] = useState({ name: '', email: '', state: '' });
  const [editingId, setEditingId] = useState(null);
  
  const [notification, setNotification] = useState("");

  // showing notification for 3 secs
  const showToast = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification("");
    }, 3000);
  };

  const fetchData = async () => {
    try {
      const usersRes = await axios.get(API_URL);
      const statsRes = await axios.get(`${API_URL}/analytics/stats`);
      setUsers(usersRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData);
        showToast("User Updated & Notification Sent!");
      } else {
        await axios.post(API_URL, formData);
        showToast("User Created & Welcome Email Sent!");
      }
      setFormData({ name: '', email: '', state: '' });
      setEditingId(null);
      fetchData();
    } catch (err) {
      console.error(err);
      showToast("Something went wrong.");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchData();
        showToast("User Deleted & Goodbye Email Sent.");
      } catch (err) {
        console.error(err);
      }
    }
  };

  // filling the form itself when we click on edit
  const handleEdit = (user) => {
    setFormData({ name: user.name, email: user.email, state: user.state });
    setEditingId(user._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans relative">
      
      {notification && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 z-50 animate-bounce-short transition-all duration-300">
          <span className="text-lg">🔔</span>
          <div>
            <h4 className="font-bold text-sm">Notification</h4>
            <p className="text-xs text-gray-300">{notification}</p>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-lg top-8">
            <h2 className="text-xl font-bold mb-4 text-blue-600">
              {editingId ? 'Edit User' : 'Add New User'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                <input
                  type="text" name="name" placeholder="John Doe"
                  value={formData.name} onChange={handleChange} required
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>
              
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Email Address</label>
                <input
                  type="email" name="email" placeholder="john@example.com"
                  value={formData.email} onChange={handleChange} required
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">State</label>
                <select
                  name="state" value={formData.state} onChange={handleChange} required
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 outline-none bg-white"
                >
                  <option value="">Select State</option>
                  {INDIAN_STATES.map(st => <option key={st} value={st}>{st}</option>)}
                </select>
              </div>

              <button type="submit" className={`w-full text-white py-2 rounded font-semibold transition ${editingId ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                {editingId ? 'Update User' : 'Create User'}
              </button>
              
              {editingId && (
                 <button 
                   type="button" 
                   onClick={() => { setEditingId(null); setFormData({name:'', email:'', state:''}); }}
                   className="w-full mt-2 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 transition"
                 >
                   Cancel Edit
                 </button>
              )}
            </form>
          </div>

          <div className="mt-8 bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-purple-600">User Analytics</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
              {stats.length === 0 ? <p className="text-gray-500 text-sm">No data available.</p> : 
                stats.map(stat => (
                  <div key={stat._id} className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <span className="text-gray-700 font-medium">{stat._id}</span>
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-bold">
                      {stat.count}
                    </span>
                  </div>
                ))
              }
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl font-bold text-gray-800">User List</h2>
               <span className="text-sm text-gray-500">Total: {users.length}</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200">
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">State</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map(user => (
                    <tr key={user._id} className="hover:bg-blue-50 transition duration-150">
                      <td className="p-4 font-medium text-gray-800">{user.name}</td>
                      <td className="p-4 text-gray-500 text-sm">{user.email}</td>
                      <td className="p-4 text-sm">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                            {user.state}
                        </span>
                      </td>
                      <td className="p-4 space-x-3 text-right">
                        <button 
                          onClick={() => handleEdit(user)} 
                          className="text-blue-600 hover:text-blue-900 font-medium text-sm transition"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(user._id)} 
                          className="text-red-500 hover:text-red-700 font-medium text-sm transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && (
                <div className="text-center py-10">
                    <p className="text-gray-400 text-lg">No users found.</p>
                    <p className="text-gray-400 text-sm">Add a user to get started.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* credits for assignment */}
      
      <footer className="mt-12 mb-6 text-center text-gray-500 text-sm border-t border-gray-200 pt-6">
        <p>
          Assignment Submission by <span className="font-bold text-gray-700">Nitin</span>
        </p>
        <a 
          href="https://github.com/nitin-is-me/CRUD-assignment" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-2 text-blue-600 hover:text-blue-800 hover:underline transition"
        >
          View Source Code on GitHub
        </a>
      </footer>
    </div>
  );
}

export default App;