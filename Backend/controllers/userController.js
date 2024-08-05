const userModel = require('../model/userModel');
const { userSchema, userSchemas } = require('../validation/validation');
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;
const jwt = require('jsonwebtoken');
const { BAD_REQUEST, INTERNAL_SERVER_ERROR, UNAUTHORIZED, sendSuccess, sendError } = require('../utils/statusCode');

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  const validation = userSchema.safeParse({ username, email, password });
  if (!validation.success) {
    return sendError(res, validation.error.issues, BAD_REQUEST);
  }

  try {
    const existingUser = await userModel.findUserByEmailAndPassword(email);
    if (existingUser) {
      return sendError(res, "Email is already registered", BAD_REQUEST);
    }

    await userModel.insertUser(username, email, password);
    sendSuccess(res, "Registered Successfully", { username, email });
  } catch (error) {
    console.error('Error registering user:', error);
    sendError(res, "Error registering user", INTERNAL_SERVER_ERROR);
  }
};

const authenticateUser = async (req, res) => {
  const { email, password } = req.body;
  const validation = userSchemas.safeParse({ email, password });
  if (!validation.success) {
    return sendError(res, validation.error.issues, BAD_REQUEST);
  }

  try {
    const user = await userModel.findUserByEmailAndPassword(email, password);
    if (user) {
      const token = userModel.generateToken(user);
      const decoded = jwt.verify(token, secretKey);
      const id = decoded.id;
      sendSuccess(res, "Authenticated Successfully", { token, id });
    } else {
      sendError(res, "Invalid User", UNAUTHORIZED);
    }
  } catch (error) {
    console.error('Error authenticating user:', error);
    sendError(res, "Error authenticating user", INTERNAL_SERVER_ERROR);
  }
};

module.exports = { registerUser, authenticateUser };
