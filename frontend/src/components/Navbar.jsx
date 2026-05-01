import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '12px 24px',
      background: '#1A56A0',
      color: 'white'
    }}>
      <Link to='/dashboard' style={{ color: 'white', fontWeight: 'bold', textDecoration: 'none', fontSize: 18 }}>
        🗂 Task Manager
      </Link>
      <span style={{ flex: 1 }} />
      {user && (
        <>
          <span style={{ fontSize: 14 }}>
            {user.name} · <strong>{user.role}</strong>
          </span>
          <button onClick={handleLogout} style={{
            background: 'transparent',
            color: 'white',
            border: '1px solid white',
            padding: '4px 14px',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 14
          }}>
            Logout
          </button>
        </>
      )}
    </nav>
  );
}
