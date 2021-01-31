const express = require('express');
const { movieController } = require('../controller');

const router = express.Router();

router.get('/', (req, res) => {
    movieController.getMovies(req, res)
});

router.get('/mostViewed', (req, res) => {
    movieController.getMostViewedMovie(req, res)
});

router.get('/mostVoted', (req, res) => {
    movieController.getMostVoted(req, res)
});

router.get('/movieDetail/:id', (req, res) => {
    movieController.getMovie(req, res)
});

router.post('/upsert', (req, res) => {
    movieController.addMovie(req, res)
});

router.put('/update', (req, res) => {
    movieController.updateMovieDetail(req, res)
});

module.exports = router;