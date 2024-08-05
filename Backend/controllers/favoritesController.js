const favoritesModel = require('../model/favoritesModel');
const { favoriteSchema } = require('../validation/validation');
const {BAD_REQUEST, INTERNAL_SERVER_ERROR, sendSuccess, sendError } = require('../utils/statusCode');

const addFavorite = async (req, res) => {
  const { imdbID } = req.body;
  const id = req.user.id;
  const validation = favoriteSchema.safeParse({ imdbID });
  if (!validation.success) {
    return sendError(res, validation.error.issues, BAD_REQUEST);
  }

  try {
    await favoritesModel.insertFavorite(id, imdbID);
    sendSuccess(res, 'Favorite added');
  } catch (error) {
    console.error('Error adding favorite:', error);
    sendError(res, 'Error adding favorite', INTERNAL_SERVER_ERROR);
  }
};

const getFavorites = async (req, res) => {
  const  userId  = req.params;
  try {
    const favorites = await favoritesModel.getFavoritesByUserId(userId);
    sendSuccess(res, 'Favorites fetched successfully', favorites);
  } catch (error) {
    console.error('Error getting favorites:', error);
    sendError(res, 'Error getting favorites', INTERNAL_SERVER_ERROR);
  }
};

const removeFavorite = async (req, res) => {
  const { userId, imdbID } = req.body;
  try {
    await favoritesModel.deleteFavorite(userId, imdbID);
    sendSuccess(res, 'Favorite removed');
  } catch (error) {
    console.error('Error removing favorite:', error);
    sendError(res, 'Error removing favorite', INTERNAL_SERVER_ERROR);
  }
};

module.exports = { addFavorite, getFavorites, removeFavorite };
