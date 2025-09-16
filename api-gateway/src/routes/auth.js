const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
require('dotenv').config();

const router = express.Router();

// --- Registration ---
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!(email && password && firstName && lastName)) {
      return res.status(400).send('All input is required');
    }

    const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);

    if (existingUser.rows.length > 0) {
      return res.status(409).send('User Already Exist. Please Login');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.query(
      'INSERT INTO users (first_name, last_name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, first_name, last_name, email',
      [firstName, lastName, email, hashedPassword]
    );

    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error registering new user.');
  }
});

// --- Login ---
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      return res.status(400).send('All input is required');
    }

    const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);

    if (userResult.rows.length === 0) {
      return res.status(400).send('Invalid Credentials');
    }
    
    const user = userResult.rows[0];

    if (await bcrypt.compare(password, user.password_hash)) {
      const token = jwt.sign(
        { user_id: user.id, email: user.email, firstName: user.first_name },
        process.env.JWT_SECRET,
        {
          expiresIn: '2h',
        }
      );

      return res.status(200).json({ token });
    }

    return res.status(400).send('Invalid Credentials');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error logging in.');
  }
});

module.exports = router; 