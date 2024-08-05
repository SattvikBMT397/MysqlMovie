const commentsModel = require('../model/commentsModel');
const { commentSchema } = require('../validation/validation');
const { BAD_REQUEST, INTERNAL_SERVER_ERROR, sendSuccess, sendError } = require('../utils/statusCode');

const addComment = async (req, res) => {
  const { userId, imdbID, comment, rating } = req.body;

  const validation = commentSchema.safeParse({ userId, imdbID, comment, rating });
  if (!validation.success) {
    return sendError(res, validation.error.issues, BAD_REQUEST);
  }

  try {
    await commentsModel.addComment(userId, imdbID, comment, rating);
    sendSuccess(res, "Comment added Successfully");
  } catch (error) {
    console.error('Error adding comments:', error);
    sendError(res, 'Error adding comments', INTERNAL_SERVER_ERROR);
  }
};

const getAllComments = async (req, res) => {
  const { imdbID } = req.params;

  if (!imdbID) {
    return sendError(res, "imdbID is required", BAD_REQUEST);
  }

  try {
    const comments = await commentsModel.getAllComments(imdbID);
    sendSuccess(res, 'Comments fetched successfully', comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    sendError(res, 'Error fetching comments', INTERNAL_SERVER_ERROR);
  }
};

module.exports = { addComment, getAllComments };
