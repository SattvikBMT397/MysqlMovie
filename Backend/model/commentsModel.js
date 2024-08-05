const db = require('../ config/db');

const createCommentsTable = async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS comments (
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      rating INT NOT NULL,
      imdbID VARCHAR(255) NOT NULL,
      comment VARCHAR(255) NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `;
  try {
    await db.query(sql);
    console.log("Comments table created successfully.");
  } catch (error) {
    console.error("Error creating comments table:", error);
  }
};

const addComment = async (userId, imdbID, comment, rating) => {
  const sql = `INSERT INTO comments (user_id, imdbID, comment, rating) VALUES (?, ?, ?, ?)`;
  try {
    await db.query(sql, [userId, imdbID, comment, rating]);
    console.log("Comment added successfully.");
  } catch (error) {
    console.error("Error adding comment:", error);
  }
};

const getAllComments = async (imdbID) => {
  const sql = `
    SELECT c.id, c.user_id, u.username, c.comment, c.rating, c.imdbID
    FROM comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.imdbID = ?
  `;
  const [data] = await db.query(sql, [imdbID]);
  return data;
};

module.exports = { addComment, getAllComments, createCommentsTable };
