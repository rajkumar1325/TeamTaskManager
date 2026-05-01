import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState({ title: '', description: '', assignee_id: '', due_date: '' });
  const [addEmail, setAddEmail] = useState('');
  const [addMsg, setAddMsg] = useState('');

  useEffect(() => {
    Promise.all([
      api.get(`/api/tasks/project/${id}`),
      api.get(`/api/projects/${id}/members`),
    ]).then(([tasksRes, membersRes]) => {
      setTasks(tasksRes.data);
      setMembers(membersRes.data);
      setLoading(false);
    });
  }, [id]);

  const createTask = async () => {
    if (!newTask.title.trim()) return alert('Task title is required');
    try {
      const res = await api.post('/api/tasks', { ...newTask, project_id: id });
      // fetch updated tasks to get assignee_name
      const tasksRes = await api.get(`/api/tasks/project/${id}`);
      setTasks(tasksRes.data);
      setNewTask({ title: '', description: '', assignee_id: '', due_date: '' });
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create task');
    }
  };

  const updateStatus = async (taskId, status) => {
    try {
      await api.patch(`/api/tasks/${taskId}/status`, { status });
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status } : t));
    } catch (err) {
      alert(err.response?.data?.error || 'Not allowed');
    }
  };

  const removeMember = async (userId) => {
    if (!window.confirm('Remove this member?')) return;
    try {
      await api.delete(`/api/projects/${id}/members/${userId}`);
      setMembers(members.filter(m => m.id !== userId));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to remove member');
    }
  };

  const addMember = async () => {
    if (!addEmail.trim()) return;
    setAddMsg('');
    try {
      // find user by email
      const res = await api.get(`/api/projects/${id}/find-user?email=${addEmail}`);
      await api.post(`/api/projects/${id}/members`, { user_id: res.data.id });
      const membersRes = await api.get(`/api/projects/${id}/members`);
      setMembers(membersRes.data);
      setAddEmail('');
      setAddMsg('Member added successfully!');
    } catch (err) {
      setAddMsg(err.response?.data?.error || 'User not found');
    }
  };

  if (loading) return <p style={{ padding: 24 }}>Loading...</p>;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>

      {/* Members */}
      <h3 style={{ color: '#1A56A0' }}>👥 Project Members</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        {members.map(m => (
          <div key={m.id} style={{
            padding: '6px 12px', background: '#f0f7ff',
            borderRadius: 20, fontSize: 13,
            display: 'flex', alignItems: 'center', gap: 8
          }}>
            <span>{m.name} <strong>({m.role})</strong></span>
            {user.role === 'admin' && m.id !== user.id && (
              <button onClick={() => removeMember(m.id)} style={{
                background: 'none', border: 'none',
                color: '#e74c3c', cursor: 'pointer', fontSize: 14
              }}>✕</button>
            )}
          </div>
        ))}
      </div>

      {/* Add Member — admin only */}
      {user.role === 'admin' && (
        <div style={{ marginBottom: 32, padding: 16,
          background: '#f9f9f9', borderRadius: 8, border: '1px solid #eee' }}>
          <h4 style={{ margin: '0 0 8px', color: '#333' }}>➕ Add Member by Email</h4>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              placeholder='Enter email address...'
              value={addEmail}
              onChange={e => setAddEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addMember()}
              style={{ flex: 1, padding: '8px 12px', borderRadius: 6,
                border: '1px solid #ccc', fontSize: 14 }}
            />
            <button onClick={addMember} style={{
              padding: '8px 16px', background: '#0D7A4E',
              color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer'
            }}>Add</button>
          </div>
          {addMsg && (
            <p style={{ margin: '8px 0 0', fontSize: 13,
              color: addMsg.includes('success') ? '#0D7A4E' : '#e74c3c' }}>
              {addMsg}
            </p>
          )}
        </div>
      )}

      {/* Create Task — admin only */}
      {user.role === 'admin' && (
        <div style={{ marginBottom: 32, padding: 16,
          background: '#f0f7ff', borderRadius: 8 }}>
          <h3 style={{ marginTop: 0, color: '#1A56A0' }}>➕ Create Task</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input
              placeholder='Task title *'
              value={newTask.title}
              onChange={e => setNewTask({ ...newTask, title: e.target.value })}
              style={{ padding: '8px 12px', borderRadius: 6,
                border: '1px solid #ccc', fontSize: 14 }}
            />
            <input
              placeholder='Description (optional)'
              value={newTask.description}
              onChange={e => setNewTask({ ...newTask, description: e.target.value })}
              style={{ padding: '8px 12px', borderRadius: 6,
                border: '1px solid #ccc', fontSize: 14 }}
            />
            <select
              value={newTask.assignee_id}
              onChange={e => setNewTask({ ...newTask, assignee_id: e.target.value })}
              style={{ padding: '8px 12px', borderRadius: 6,
                border: '1px solid #ccc', fontSize: 14 }}
            >
              <option value=''>Assign to member...</option>
              {members.map(m => (
                <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
              ))}
            </select>
            <input
              type='date'
              value={newTask.due_date}
              onChange={e => setNewTask({ ...newTask, due_date: e.target.value })}
              style={{ padding: '8px 12px', borderRadius: 6,
                border: '1px solid #ccc', fontSize: 14 }}
            />
            <button onClick={createTask} style={{
              padding: '10px', background: '#1A56A0',
              color: 'white', border: 'none',
              borderRadius: 6, cursor: 'pointer', fontSize: 14
            }}>Add Task</button>
          </div>
        </div>
      )}

      {/* Tasks */}
      <h3 style={{ color: '#1A56A0' }}>📋 Tasks</h3>
      {tasks.length === 0 ? (
        <p style={{ color: '#999' }}>No tasks yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {tasks.map(t => (
            <div key={t.id} style={{
              padding: 14,
              border: `1px solid ${t.is_overdue ? '#e74c3c' : '#ddd'}`,
              background: t.is_overdue ? '#fff5f5' : 'white',
              borderRadius: 8,
              display: 'flex', alignItems: 'center', gap: 12
            }}>
              <div style={{ flex: 1 }}>
                <strong>{t.title}</strong>
                {t.is_overdue && (
                  <span style={{ marginLeft: 8, color: '#e74c3c',
                    fontSize: 12, fontWeight: 'bold' }}>⚠ OVERDUE</span>
                )}
                {t.description && (
                  <p style={{ margin: '2px 0 0', fontSize: 12, color: '#555' }}>
                    {t.description}
                  </p>
                )}
                <p style={{ margin: '2px 0 0', fontSize: 12, color: '#888' }}>
                  👤 {t.assignee_name || 'Unassigned'}
                  {t.due_date && ` · Due: ${t.due_date.slice(0, 10)}`}
                </p>
              </div>
              {(user.role === 'admin' || t.assignee_id === user.id) ? (
                <select
                  value={t.status}
                  onChange={e => updateStatus(t.id, e.target.value)}
                  style={{
                    padding: '6px 10px', borderRadius: 6,
                    border: '1px solid #ccc', fontSize: 13,
                    background: t.status === 'done' ? '#e6f7ee' :
                      t.status === 'in-progress' ? '#fff8e6' : 'white'
                  }}
                >
                  <option value='todo'>To Do</option>
                  <option value='in-progress'>In Progress</option>
                  <option value='done'>Done ✓</option>
                </select>
              ) : (
                <span style={{
                  padding: '6px 10px', borderRadius: 6, fontSize: 13,
                  background: t.status === 'done' ? '#e6f7ee' :
                    t.status === 'in-progress' ? '#fff8e6' : '#f5f5f5',
                  color: '#555'
                }}>{t.status}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}