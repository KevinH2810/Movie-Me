const express = require('express');
const { actorController } = require('../controller');

const router = express.Router();

router.get('/', (req, res) => {
  actorController.getActors(req, res)
});

router.get('/:id', (req, res) => {
  actorController.getActor(req, res)
});

router.post('/addActor', (req, res) => {
  actorController.addActor(req, res)
});

router.put('/updateActor', (req, res) => {
  actorController.updateActor(req, res)
});

module.exports = router;