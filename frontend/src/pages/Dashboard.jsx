import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/api/tasks/my'),
      api.get('/api/projects')
    ]).then(([tasksRes, projectsRes]) => {
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
      setLoading(false);
    });
  }, []);

  const createProject = async () => {
    if (!newProject.trim()) return;
    try {
      const res = await api.post('/api/projects', { name: newProject });
      setProjects([res.data, ...projects]);
      setNewProject('');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create project');
    }
  };

  const updateStatus = async (taskId, status) => {
    try {
      await api.patch(`/api/tasks/${taskId}/status`, { status });
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status } : t));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update status');
    }
  };

  if (loading) return <p style={{ padding: 24 }}>Loading...</p>;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>

      {/* Welcome */}
      <h2 style={{ color: '#1A56A0' }}>
        👋 Welcome, {user.name}
        <span style={{ fontSize: 14, fontWeight: 'normal',
          marginLeft: 10, color: '#666' }}>({user.role})</span>
      </h2>

      {/* Create project — admins only */}
      {user.role === 'admin' && (
        <div style={{ marginBottom: 32, padding: 16,
          background: '#f0f7ff', borderRadius: 8 }}>
          <h3 style={{ marginTop: 0, color: '#1A56A0' }}>➕ Create New Project</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={newProject}
              onChange={e => setNewProject(e.target.value)}
              placeholder='Project name...'
              onKeyDown={e => e.key === 'Enter' && createProject()}
              style={{ flex: 1, padding: '8px 12px',
                borderRadius: 6, border: '1px solid #ccc', fontSize: 14 }}
            />
            <button onClick={createProject} style={{
              padding: '8px 16px', background: '#1A56A0',
              color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer'
            }}>
              Create
            </button>
          </div>
        </div>
      )}

      {/* My Projects */}
      <h3 style={{ color: '#333' }}>📁 My Projects</h3>
      {projects.length === 0 ? (
        <p style={{ color: '#999' }}>No projects yet.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: 32 }}>
          {projects.map(p => (
            <Link key={p.id} to={`/projects/${p.id}`} style={{ textDecoration: 'none' }}>
              <div style={{
                padding: 16, border: '1px solid #ddd',
                borderRadius: 8, background: 'white',
                cursor: 'pointer', transition: 'box-shadow 0.2s'
              }}
                onMouseOver={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'}
                onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}
              >
                <strong style={{ color: '#1A56A0' }}>{p.name}</strong>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: '#888' }}>
                  Role: {p.my_role || 'admin'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* My Tasks */}
      <h3 style={{ color: '#333' }}>✅ My Tasks</h3>
      {tasks.length === 0 ? (
        <p style={{ color: '#999' }}>No tasks assigned to you yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {tasks.map(t => (
            <div key={t.id} style={{
              padding: 14,
              border: `1px solid ${t.is_overdue ? '#e74c3c' : '#ddd'}`,
              background: t.is_overdue ? '#fff5f5' : 'white',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 12
            }}>
              <div style={{ flex: 1 }}>
                <strong>{t.title}</strong>
                {t.is_overdue && (
                  <span style={{ marginLeft: 8, color: '#e74c3c',
                    fontSize: 12, fontWeight: 'bold' }}>⚠ OVERDUE</span>
                )}
                <p style={{ margin: '2px 0 0', fontSize: 12, color: '#888' }}>
                  {t.project_name} {t.due_date && `· Due: ${t.due_date.slice(0, 10)}`}
                </p>
              </div>
              <select
                value={t.status}
                onChange={e => updateStatus(t.id, e.target.value)}
                style={{ padding: '6px 10px', borderRadius: 6,
                  border: '1px solid #ccc', fontSize: 13,
                  background: t.status === 'done' ? '#e6f7ee' :
                    t.status === 'in-progress' ? '#fff8e6' : 'white'
                }}
              >
                <option value='todo'>To Do</option>
                <option value='in-progress'>In Progress</option>
                <option value='done'>Done ✓</option>
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}