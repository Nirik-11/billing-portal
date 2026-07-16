import React, { useEffect, useState } from 'react';
import api from '../api.js';

const ROLES = ['admin', 'manager', 'member'];

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState('');

  const loadUsers = () => {
    api.get('/api/users').then((res) => {
      setUsers(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (id, role) => {
    setSavingId(id);
    try {
      await api.patch(`/api/users/${id}/role`, { role });
      loadUsers();
    } finally {
      setSavingId('');
    }
  };

  if (loading) return <div className="page">Loading...</div>;

  return (
    <div className="page">
      <h1>Manage users</h1>
      <p className="subtle">Admin only</p>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Plan</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.plan}</td>
              <td>
                <select
                  value={u.role}
                  disabled={savingId === u._id}
                  onChange={(e) => handleRoleChange(u._id, e.target.value)}
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
