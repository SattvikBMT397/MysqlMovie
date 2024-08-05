const db = require('../ config/db');

const createFavoritesTable = async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS favorites (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL ,
      imdbID VARCHAR(255) NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `;
  await db.query(sql);
};

const insertFavorite = async (userId, imdbID) => {
  const sql = 'INSERT INTO favorites (user_id, imdbID) VALUES (?, ?)';
  await db.query(sql, [userId, imdbID,]);
};

const getFavoritesByUserId = async (userId) => {
const userid=userId.user_id;
  const sql = 'SELECT * FROM favorites WHERE user_id = ?';
  const [rows] = await db.query(sql, [userid]);
  return rows;
};

const deleteFavorite = async (userId, imdbID) => {
  console.log("userId",userId);
  console.log("imdbID",imdbID);
  const sql = 'DELETE FROM favorites WHERE user_id = ? AND imdbID = ?';
  await db.query(sql, [userId, imdbID]);
};

module.exports = { createFavoritesTable, insertFavorite, getFavoritesByUserId, deleteFavorite };
