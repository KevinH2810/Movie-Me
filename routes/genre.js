const express = require('express');
const { genreController } = require('../controller');

const router = express.Router();

router.get('/MostViewed', (req, res) => {
  genreController.getMostViewedGenre(req, res)
});

// router.put('/update', (req, res) => {
//   movieController.updateMovieURL(req, res)
// });

module.exports = router;