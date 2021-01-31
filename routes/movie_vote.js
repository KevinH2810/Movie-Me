const express = require('express');
const { movieVoteController } = require('../controller');

const router = express.Router();

router.get('/', (req, res) => {
  movieVoteController.getMovieVoteByUserId(req, res)
});

router.get('/getByMovieId', (req, res) => {
  movieVoteController.getMovieVoteByMovieId(req, res)
});

router.put('/update', (req, res) => {
  movieVoteController.upsertMovieVote(req, res)
});

module.exports = router;