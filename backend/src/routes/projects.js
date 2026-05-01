const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/db');
const authMW = require('../middleware/auth');
const router = express.Router();

// GET /api/projects — get all projects the logged-in user belongs to
router.get('/', authMW, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, u.name as owner_name, pm.role as my_role
      FROM projects p
      JOIN project_members pm ON p.id = pm.project_id
      JOIN users u ON p.owner_id = u.id
      WHERE pm.user_id = $1
      ORDER BY p.created_at DESC
    `, [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/projects — create a new project (admin only)
router.post('/', authMW, [
  body('name').notEmpty().withMessage('Project name is required'),
], async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admins only' });
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description } = req.body;
  try {
    const proj = await pool.query(
      'INSERT INTO projects (name,description,owner_id) VALUES ($1,$2,$3) RETURNING *',
      [name, description, req.user.id]
    );
    // Auto-add the creator as admin member of the project
    await pool.query(
      'INSERT INTO project_members (project_id,user_id,role) VALUES ($1,$2,$3)',
      [proj.rows[0].id, req.user.id, 'admin']
    );
    res.status(201).json(proj.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/projects/:id — delete a project (admin only)
router.delete('/:id', authMW, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admins only' });
  }
  try {
    await pool.query(
      'DELETE FROM projects WHERE id=$1 AND owner_id=$2',
      [req.params.id, req.user.id]
    );
    res.json({ message: 'Project deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;