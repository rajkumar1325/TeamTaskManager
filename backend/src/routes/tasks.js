const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/db');
const authMW = require('../middleware/auth');
const router = express.Router();

// GET /api/tasks/my — dashboard: all tasks assigned to logged-in user
router.get('/my', authMW, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT t.*, p.name as project_name,
             CASE WHEN t.due_date < CURRENT_DATE AND t.status != 'done'
                  THEN true ELSE false END as is_overdue
      FROM tasks t
      JOIN projects p ON t.project_id = p.id
      WHERE t.assignee_id = $1
      ORDER BY t.due_date ASC NULLS LAST
    `, [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/tasks/project/:projectId ---- all tasks in a project
router.get('/project/:projectId', authMW, async (req, res) => {
  try {
    // First check user is actually a member of this project
    const membership = await pool.query(
      'SELECT role FROM project_members WHERE project_id=$1 AND user_id=$2',
      [req.params.projectId, req.user.id]
    );
    if (membership.rows.length === 0) {
      return res.status(403).json({ error: 'Not a member of this project' });
    }

    const result = await pool.query(`
      SELECT t.*, u.name as assignee_name,
             CASE WHEN t.due_date < CURRENT_DATE AND t.status != 'done'
                  THEN true ELSE false END as is_overdue
      FROM tasks t
      LEFT JOIN users u ON t.assignee_id = u.id
      WHERE t.project_id = $1
      ORDER BY t.created_at DESC
    `, [req.params.projectId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/tasks -- create a task (admin only)
router.post('/', authMW, [
  body('title').notEmpty().withMessage('Title required'),
  body('project_id').notEmpty().withMessage('Project ID required'),
], async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admins only' });
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, project_id, assignee_id, due_date } = req.body;
  try {
    const result = await pool.query(`
      INSERT INTO tasks (title,description,project_id,assignee_id,due_date,created_by)
      VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [title, description, project_id, assignee_id, due_date, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/tasks/:id/status — update task status
router.patch('/:id/status', authMW, [
  body('status').isIn(['todo', 'in-progress', 'done']).withMessage('Invalid status'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const taskResult = await pool.query('SELECT * FROM tasks WHERE id=$1', [req.params.id]);
    if (taskResult.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    const task = taskResult.rows[0];

    // Members can only update tasks assigned to them
    if (req.user.role !== 'admin' && task.assignee_id !== req.user.id) {
      return res.status(403).json({ error: 'You can only update your own tasks' });
    }

    const updated = await pool.query(
      'UPDATE tasks SET status=$1 WHERE id=$2 RETURNING *',
      [req.body.status, req.params.id]
    );
    res.json(updated.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;