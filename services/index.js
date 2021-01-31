const ActorService = require('./ActorService')
const HistoryService = require('./HistoryService')
const GenreService = require('./GenreServices')
const MovieService = require('./MovieService');
const MovieCastService = require('./MovieCastService')
const MovieGenreService = require('./MovieGenreService')
const MovieURLService = require('./MovieURLService')

module.exports = {
  MovieService,
  ActorService,
  MovieCastService,
  GenreService,
  MovieGenreService,
  MovieURLService,
  HistoryService,
}