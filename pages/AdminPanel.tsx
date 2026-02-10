
import React, { useState } from 'react';
import { Users, Activity, DollarSign, Server, Edit2, Save, X, Search } from 'lucide-react';
import { User } from '../types';
import { MOCK_USERS } from '../services/mockService';

export const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<User>>({});
  const [searchTerm, setSearchTerm] = useState('');

  const activeUsers = users.filter(u => u.isOnline).length;
  const totalRevenue = users.reduce((acc, user) => {
    if (user.plan === 'Pro') return acc + 149;
    if (user.plan === 'Enterprise') return acc + 499;
    return acc;
  }, 0);

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setEditForm(user);
  };

  const handleSave = () => {
    setUsers(users.map(u => (u.id === editingId ? { ...u, ...editForm } : u)));
    setEditingId(null);
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8 animate-fade-in h-full overflow-y-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Control Center</h1>
          <p className="text-slate-400">System analytics and user management.</p>
        </div>
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-full">
           <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
           <span className="text-red-400 font-mono text-xs">LIVE ENVIRONMENT</span>
        </div>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Active Sessions', value: activeUsers, icon: Activity, color: 'text-green-400' },
          { label: 'Total Users', value: users.length, icon: Users, color: 'text-blue-400' },
          { label: 'Monthly Revenue', value: `$${totalRevenue}`, icon: DollarSign, color: 'text-yellow-400' },
          { label: 'Server Load', value: '12%', icon: Server, color: 'text-purple-400' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl">
            <div className="flex justify-between items-start mb-2">
              <span className="text-slate-400 text-sm font-medium">{stat.label}</span>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* User Management Table */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden flex flex-col min-h-[500px]">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">User Directory</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-900 text-slate-200">
              <tr>
                <th className="p-4 font-medium">User Status</th>
                <th className="p-4 font-medium">Identity</th>
                <th className="p-4 font-medium">Plan</th>
                <th className="p-4 font-medium">Daily Limit (MCs)</th>
                <th className="p-4 font-medium">Usage Today</th>
                <th className="p-4 font-medium">IP Address</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${user.isOnline ? 'bg-green-500' : 'bg-slate-500'}`} />
                      <span>{user.isOnline ? 'Online' : user.lastActive}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-white">{user.name}</div>
                    <div className="text-xs">{user.email}</div>
                  </td>
                  <td className="p-4">
                     {editingId === user.id ? (
                        <select 
                          className="bg-slate-900 border border-slate-600 rounded p-1 text-white"
                          value={editForm.plan}
                          onChange={e => setEditForm({...editForm, plan: e.target.value as any})}
                        >
                          <option value="Free">Free</option>
                          <option value="Starter">Starter</option>
                          <option value="Pro">Pro</option>
                          <option value="Enterprise">Enterprise</option>
                        </select>
                     ) : (
                        <span className={`px-2 py-1 rounded text-xs font-bold 
                          ${user.plan === 'Enterprise' ? 'bg-purple-500/20 text-purple-300' : 
                            user.plan === 'Pro' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-600/20 text-slate-300'}`}>
                          {user.plan}
                        </span>
                     )}
                  </td>
                  <td className="p-4 font-mono">
                    {editingId === user.id ? (
                      <input 
                        type="number"
                        className="bg-slate-900 border border-slate-600 rounded p-1 text-white w-24"
                        value={editForm.dailyLimit}
                        onChange={e => setEditForm({...editForm, dailyLimit: parseInt(e.target.value)})}
                      />
                    ) : (
                      user.dailyLimit.toLocaleString()
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-700 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${user.recordsExtractedToday > user.dailyLimit * 0.9 ? 'bg-red-500' : 'bg-indigo-500'}`} 
                          style={{ width: `${Math.min((user.recordsExtractedToday / user.dailyLimit) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs">{user.recordsExtractedToday}</span>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-xs text-slate-500">{user.ipAddress}</td>
                  <td className="p-4">
                    {editingId === user.id ? (
                      <div className="flex gap-2">
                        <button onClick={handleSave} className="p-1.5 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30">
                          <Save size={16} />
                        </button>
                        <button onClick={() => setEditingId(null)} className="p-1.5 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30">
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => handleEdit(user)} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors">
                        <Edit2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
