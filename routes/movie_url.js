const express = require('express');
const { movieURLController } = require('../controller');

const router = express.Router();

router.get('/', (req, res) => {
    movieURLController.getMovieURL(req, res)
});

router.post('/add', (req, res) => {
  movieURLController.addMovieURL(req, res)
});

router.put('/update', (req, res) => {
  movieController.updateMovieURL(req, res)
});

module.exports = router;