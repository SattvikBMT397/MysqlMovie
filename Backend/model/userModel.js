const db = require('../ config/db');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;
const createUserTable = async () => {
  const sql = `
     CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL
    )`;
  await db.query(sql);
};

const insertUser = async (username,email, password) => {
  const sql = 'INSERT INTO users (username,email,password) VALUES (?,?,?)';
  await db.query(sql, [username,email, password]);
};

const findUserByEmailAndPassword = async (email, password) => {
  const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
  const [rows] = await db.query(sql, [email, password]);
  return rows[0];
};

const findUserById = async (id) => {
  const sql = 'SELECT * FROM users WHERE id = ?';
  const [rows] = await db.query(sql, [id]);
  return rows[0];
};

const generateToken = (user) => {
  const payload = { id: user.id };
  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

module.exports = {
  createUserTable,
  insertUser,
  findUserByEmailAndPassword,
  findUserById,
  generateToken
};
