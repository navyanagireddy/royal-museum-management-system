const express = require('express');
const MuseumController = require('../controllers/museumController');

const router = express.Router();
const museumController = new MuseumController();

router.get('/museums', museumController.getAllMuseums.bind(museumController));
router.get('/museums/:id', museumController.getMuseumById.bind(museumController));

module.exports = router;