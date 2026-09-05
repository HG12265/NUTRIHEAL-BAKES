import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, Calendar, ShieldCheck, User } from 'lucide-react';
import api from '../../services/api';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/admin/users');
        if (res.data.success) {
          setUsers(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Registered Users</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Customer and administrator directory
        </p>
      </div>

      <div className="card" style={{ backgroundColor: '#FFFFFF', overflow: 'hidden' }}>
        {loading ? (
          <LoadingSpinner size={32} message="Loading user directory..." />
        ) : users.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No registered users found.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Joined Date</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '50%',
                            backgroundColor: u.role === 'admin' ? 'var(--highlight-gold-light)' : 'var(--primary-light)',
                            color: u.role === 'admin' ? '#8C6212' : 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {u.role === 'admin' ? <ShieldCheck size={18} /> : <User size={18} />}
                        </div>
                        <strong style={{ fontSize: '0.92rem' }}>{u.name}</strong>
                      </div>
                    </td>

                    <td>
                      <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                        {u.email}
                      </span>
                    </td>

                    <td>
                      <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                        {u.phone || '—'}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`badge ${u.role === 'admin' ? 'badge-gold' : 'badge-primary'}`}
                        style={{ fontSize: '0.72rem' }}
                      >
                        {u.role}
                      </span>
                    </td>

                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
