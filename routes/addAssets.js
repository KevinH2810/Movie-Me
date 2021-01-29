const express = require('express');
const { topupController } = require('../controller');

const router = express.Router();

router.post('/', (req, res) => {
    topupController.AddAssets(req, res)
});

module.exports = router;