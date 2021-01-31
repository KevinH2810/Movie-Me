const express = require('express');
const { movieController } = require('../controller');

const router = express.Router();

router.get('/', (req, res) => {
    movieController.getMovies(req, res)
});

router.get('/mostViewed', (req, res) => {
    movieController.getMostViewed(req, res)
});

router.get('/mostVoted', (req, res) => {
    movieController.getMostVoted(req, res)
});

router.get('/movieDetail/:id', (req, res) => {
    movieController.getMovie(req, res)
});

router.post('/add', (req, res) => {
    movieController.addMovie(req, res)
});

router.put('/update', (req, res) => {
    movieController.updateMovieDetail(req, res)
});

router.delete('/delete', (req, res) => {
    movieController.deleteMovie(req, res)
  });

module.exports = router;