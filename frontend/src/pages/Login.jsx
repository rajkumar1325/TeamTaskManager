import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/api/auth/login', { email, password });
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: 24,
      border: '1px solid #ddd', borderRadius: 12 }}>
      <h2 style={{ marginBottom: 24, color: '#1A56A0' }}>🔐 Login</h2>
      {error && (
        <p style={{ color: 'red', background: '#fff5f5',
          padding: '8px 12px', borderRadius: 6 }}>{error}</p>
      )}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input
          type='email'
          placeholder='Email'
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ padding: '10px 12px', borderRadius: 6,
            border: '1px solid #ccc', fontSize: 14 }}
        />
        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ padding: '10px 12px', borderRadius: 6,
            border: '1px solid #ccc', fontSize: 14 }}
        />
        <button type='submit' disabled={loading} style={{
          padding: '10px',
          background: '#1A56A0',
          color: 'white',
          border: 'none',
          borderRadius: 6,
          fontSize: 15,
          cursor: loading ? 'not-allowed' : 'pointer'
        }}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p style={{ marginTop: 16, fontSize: 14, color: '#666' }}>
        No account? <Link to='/signup' style={{ color: '#1A56A0' }}>Sign up</Link>
      </p>
    </div>
  );
}