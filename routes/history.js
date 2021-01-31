const express = require('express');
const { historyController } = require('../controller');

const router = express.Router();

router.get('/', (req, res) => {
  historyController.getUserViewHistory(req, res)
});

router.post('/addHistory', (req, res) => {
  historyController.insertHistory(req, res)
});

module.exports = router;