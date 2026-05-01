import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'member' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/api/auth/signup', form);
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: 24,
      border: '1px solid #ddd', borderRadius: 12 }}>
      <h2 style={{ marginBottom: 24, color: '#1A56A0' }}>✍️ Create Account</h2>
      {error && (
        <p style={{ color: 'red', background: '#fff5f5',
          padding: '8px 12px', borderRadius: 6 }}>{error}</p>
      )}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input
          name='name'
          placeholder='Full Name'
          value={form.name}
          onChange={handleChange}
          required
          style={{ padding: '10px 12px', borderRadius: 6,
            border: '1px solid #ccc', fontSize: 14 }}
        />
        <input
          name='email'
          type='email'
          placeholder='Email'
          value={form.email}
          onChange={handleChange}
          required
          style={{ padding: '10px 12px', borderRadius: 6,
            border: '1px solid #ccc', fontSize: 14 }}
        />
        <input
          name='password'
          type='password'
          placeholder='Password (min 6 characters)'
          value={form.password}
          onChange={handleChange}
          required
          style={{ padding: '10px 12px', borderRadius: 6,
            border: '1px solid #ccc', fontSize: 14 }}
        />
        <select
          name='role'
          value={form.role}
          onChange={handleChange}
          style={{ padding: '10px 12px', borderRadius: 6,
            border: '1px solid #ccc', fontSize: 14 }}
        >
          <option value='member'>Member</option>
          <option value='admin'>Admin</option>
        </select>
        <button type='submit' disabled={loading} style={{
          padding: '10px',
          background: '#1A56A0',
          color: 'white',
          border: 'none',
          borderRadius: 6,
          fontSize: 15,
          cursor: loading ? 'not-allowed' : 'pointer'
        }}>
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
      <p style={{ marginTop: 16, fontSize: 14, color: '#666' }}>
        Already have an account? <Link to='/login' style={{ color: '#1A56A0' }}>Login</Link>
      </p>
    </div>
  );
}