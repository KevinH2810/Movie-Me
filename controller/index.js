const AuthController = require('./AuthController')
const MovieController = require('./MovieController')
const TokenController = require("./MovieController")

module.exports = {
    authController: new AuthController(),
    movieController: new MovieController(),
    tokenController: new TokenController(),
}