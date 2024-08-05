const express =require("express");
const app= express();
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const favoritesRoutes= require('./routes/favoritesRoutes')
const userModel = require('./model/userModel');
const favoritesModel = require('./model/favoritesModel');
const commentsModel = require('./model/commentsModel');
const commentsRoutes = require('./routes/commentsRoutes');

app.use(bodyParser.json());

  (async () => {
    try {
      await userModel.createUserTable();
      await favoritesModel.createFavoritesTable();
      await commentsModel.createCommentsTable();
    } catch (error) {
      console.error('Error initializing tables:', error);
    }
  })();
  const corsOptions = {
    origin: 'http://localhost:5173',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
  };
  app.use(cors(corsOptions));
  app.use('/api/users',userRoutes)
  app.use('/api/favorites',favoritesRoutes);
  app.use('/api/comment',commentsRoutes);

  app.get('/', (req, res) => {
    res.send('Welcome to the API');
  });
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });