const AuthController = require('./AuthController')
const MovieController = require('./MovieController')
const TokenController = require("./MovieController")
const MovieURLController = require("./MovieURLController")
const GenreController = require("./GenreController")

module.exports = {
    authController: new AuthController(),
    movieController: new MovieController(),
    tokenController: new TokenController(),
    movieURLController: new MovieURLController(),
    genreController: new GenreController(),
}