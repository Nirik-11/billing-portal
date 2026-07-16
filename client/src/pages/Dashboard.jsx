import React, { useEffect, useState } from 'react';
import api from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

const PLAN_ORDER = ['Free', 'Pro', 'Enterprise'];

export default function Dashboard() {
  const { user, updateUser } = useAuth();
  const [plans, setPlans] = useState({});
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState('');

  const loadData = async () => {
    const [plansRes, meRes] = await Promise.all([
      api.get('/api/billing/plans'),
      api.get('/api/billing/me'),
    ]);
    setPlans(plansRes.data);
    setInvoices(meRes.data.invoices);
    updateUser(meRes.data.user);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpgrade = async (plan) => {
    setUpgrading(plan);
    try {
      await api.post('/api/billing/upgrade', { plan });
      await loadData();
    } finally {
      setUpgrading('');
    }
  };

  if (loading) return <div className="page">Loading...</div>;

  return (
    <div className="page">
      <h1>Welcome, {user.name}</h1>
      <p className="subtle">Role: {user.role} · Current plan: {user.plan}</p>

      <h2>Plans</h2>
      <div className="plan-grid">
        {PLAN_ORDER.map((planName) => {
          const isCurrent = user.plan === planName;
          return (
            <div key={planName} className={`plan-card ${isCurrent ? 'plan-current' : ''}`}>
              <h3>{planName}</h3>
              <p className="price">
                {plans[planName]?.price === 0 ? 'Free' : `₹${plans[planName]?.price}/mo`}
              </p>
              {isCurrent ? (
                <span className="badge-current">Current plan</span>
              ) : (
                <button
                  className="btn-primary"
                  onClick={() => handleUpgrade(planName)}
                  disabled={upgrading === planName}
                >
                  {upgrading === planName ? 'Updating...' : 'Switch to this plan'}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <h2>Your invoices</h2>
      {invoices.length === 0 ? (
        <p className="subtle">No invoices yet.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Plan</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv._id}>
                <td>{new Date(inv.issuedAt).toLocaleDateString()}</td>
                <td>{inv.plan}</td>
                <td>₹{inv.amount}</td>
                <td>
                  <span className={`status status-${inv.status}`}>{inv.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
