  module.exports = function(app) {
      app.use('/register', require('./register'));
      app.use('/login', require('./login'));
      app.use('/addmoney', require('./addmoney'));
      app.use('/addAssets', require('./addAssets'));
      app.use('/movie', require('./movie'));
  }