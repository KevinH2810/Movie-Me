  module.exports = function(app) {
      app.use('/register', require('./register'));
      app.use('/login', require('./login'));
      app.use('/actor', require('./actor'));
      app.use('/genre', require('./genre'));
      app.use('/search', require('./search'));
      app.use('/movie', require('./movie'));
      app.use('/movie_vote', require('./movie_vote'));
      app.use('/movie_url', require('./movie_url'));
      
  }