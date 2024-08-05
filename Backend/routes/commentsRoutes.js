const express = require('express');
const commentsController = require('../controllers/commentsController');

const router = express.Router();

router.post('/add',commentsController.addComment);
router.get('/:imdbID',commentsController.getAllComments);

module.exports = router;