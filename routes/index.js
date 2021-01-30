  module.exports = function(app) {
      app.use('/register', require('./register'));
      app.use('/login', require('./login'));
      app.use('/addmoney', require('./addmoney'));
      app.use('/genre', require('./genre'));
      app.use('/movie', require('./movie'));
  }