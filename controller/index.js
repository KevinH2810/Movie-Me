const ActorController = require('./ActorController')
const AuthController = require('./AuthController')
const MovieController = require('./MovieController')
const TokenController = require("./MovieController")
const MovieURLController = require("./MovieURLController")
const GenreController = require("./GenreController")
const SearchController = require("./SearchController")

module.exports = {
    actorController: new ActorController(),
    authController: new AuthController(),
    movieController: new MovieController(),
    tokenController: new TokenController(),
    movieURLController: new MovieURLController(),
    genreController: new GenreController(),
    searchController: new SearchController(),
}