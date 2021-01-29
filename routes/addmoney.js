const express = require('express');
const { topupController } = require('../controller');

const router = express.Router();

router.put('/', (req, res) => {
    topupController.AddMoney(req, res)
});

module.exports = router;