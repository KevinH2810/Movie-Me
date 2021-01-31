const ActorController = require('./ActorController')
const AuthController = require('./AuthController')
const MovieController = require('./MovieController')
const TokenController = require("./MovieController")
const MovieURLController = require("./MovieURLController")
const MovieVoteController = require("./MovieVoteController")
const GenreController = require("./GenreController")
const SearchController = require("./SearchController")
const HistoryController = require("./HistoryController")

module.exports = {
    actorController: new ActorController(),
    authController: new AuthController(),
    movieController: new MovieController(),
    tokenController: new TokenController(),
    movieURLController: new MovieURLController(),
    movieVoteController: new MovieVoteController(),
    genreController: new GenreController(),
    searchController: new SearchController(),
    historyController: new HistoryController(),
}