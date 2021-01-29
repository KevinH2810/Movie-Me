const express = require('express');
const { movieController } = require('../controller');

const router = express.Router();

router.get('/', (req, res) => {
    movieController.getMovie(req, res)
});

router.post('/add', (req, res) => {
    movieController.addMovie(req, res)
});

module.exports = router;