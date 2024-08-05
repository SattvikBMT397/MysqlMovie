const jwt = require('jsonwebtoken');
const { findUserById } = require('../model/userModel');
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;
const authenticateJWT = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access token is missing or invalid' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    const user = await findUserById(decoded.id);  
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user; 
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authenticateJWT;
