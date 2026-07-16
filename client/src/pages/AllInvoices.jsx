import React, { useEffect, useState } from 'react';
import api from '../api.js';

export default function AllInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/billing/invoices').then((res) => {
      setInvoices(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="page">Loading...</div>;

  return (
    <div className="page">
      <h1>All invoices</h1>
      <p className="subtle">Visible to admins and managers</p>
      <table className="table">
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Plan</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr key={inv._id}>
              <td>{inv.user?.name}</td>
              <td>{inv.user?.email}</td>
              <td>{inv.plan}</td>
              <td>₹{inv.amount}</td>
              <td>
                <span className={`status status-${inv.status}`}>{inv.status}</span>
              </td>
              <td>{new Date(inv.issuedAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
