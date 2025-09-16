const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
});

pool.on('connect', () => {
  console.log('Connected to the PostgreSQL database!');
});

module.exports = {
  query: (text, params) => pool.query(text, params),
}; 