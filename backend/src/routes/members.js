const express = require('express');
const pool = require('../config/db');
const authMW = require('../middleware/auth');
const router = express.Router();

// GET /api/projects/:id/members — get all members of a project
router.get('/:id/members', authMW, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.id, u.name, u.email, pm.role, pm.joined_at
      FROM project_members pm
      JOIN users u ON pm.user_id = u.id
      WHERE pm.project_id = $1
    `, [req.params.id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/projects/:id/find-user?email=... — look up a user by email (admin only)
router.get('/:id/find-user', authMW, async (req, res) => {
  // Check project-level admin role (not global role)
  const roleCheck = await pool.query(
    'SELECT role FROM project_members WHERE project_id=$1 AND user_id=$2',
    [req.params.id, req.user.id]
  );
  if (!roleCheck.rows.length || roleCheck.rows[0].role !== 'admin') {
    return res.status(403).json({ error: 'Project admins only' });
  }

  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    const result = await pool.query(
      'SELECT id, name, email FROM users WHERE email = $1',
      [email.trim().toLowerCase()]
    );
    if (!result.rows.length) {
      return res.status(404).json({ error: 'No user found with that email' });
    }

    // Check if already a member
    const alreadyMember = await pool.query(
      'SELECT 1 FROM project_members WHERE project_id=$1 AND user_id=$2',
      [req.params.id, result.rows[0].id]
    );
    if (alreadyMember.rows.length) {
      return res.status(409).json({ error: 'User is already a member of this project' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/projects/:id/members — add a member (project admin only)
router.post('/:id/members', authMW, async (req, res) => {
  // Check project-level admin role (not global role)
  const roleCheck = await pool.query(
    'SELECT role FROM project_members WHERE project_id=$1 AND user_id=$2',
    [req.params.id, req.user.id]
  );
  if (!roleCheck.rows.length || roleCheck.rows[0].role !== 'admin') {
    return res.status(403).json({ error: 'Project admins only' });
  }

  const { user_id, role } = req.body;
  if (!user_id) return res.status(400).json({ error: 'user_id is required' });

  try {
    await pool.query(
      'INSERT INTO project_members (project_id,user_id,role) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING',
      [req.params.id, user_id, role || 'member']
    );
    res.status(201).json({ message: 'Member added' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/projects/:id/members/:userId — remove a member (project admin only)
router.delete('/:id/members/:userId', authMW, async (req, res) => {
  // Check project-level admin role (not global role)
  const roleCheck = await pool.query(
    'SELECT role FROM project_members WHERE project_id=$1 AND user_id=$2',
    [req.params.id, req.user.id]
  );
  if (!roleCheck.rows.length || roleCheck.rows[0].role !== 'admin') {
    return res.status(403).json({ error: 'Project admins only' });
  }

  try {
    await pool.query(
      'DELETE FROM project_members WHERE project_id=$1 AND user_id=$2',
      [req.params.id, req.params.userId]
    );
    res.json({ message: 'Member removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;