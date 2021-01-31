const express = require('express');
const { searchController } = require('../controller');

const router = express.Router();

router.get('/', (req, res) => {
  searchController.searchKeyword(req, res)
});


module.exports = router;