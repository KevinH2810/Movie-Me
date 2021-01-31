const express = require('express');
const { genreController } = require('../controller');

const router = express.Router();

router.get('/', (req, res) => {
  genreController.getGenres(req, res)
});

router.get('/MostViewed', (req, res) => {
  genreController.getMostViewedGenre(req, res)
});

router.get('/:id', (req, res) => {
  genreController.getGenrebyId(req, res)
});

router.post('/addGenre', (req, res) => {
  genreController.insertGenre(req, res)
});

router.put('/update', (req, res) => {
  genreController.updateGenre(req, res)
});

router.delete('/delete', (req, res) => {
  genreController.deleteGenre(req, res)
});

module.exports = router;