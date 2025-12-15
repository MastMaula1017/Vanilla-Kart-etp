const express = require('express');
const router = express.Router();
const { getTurnCredentials } = require('../controllers/turnController');

router.get('/credentials', getTurnCredentials);

module.exports = router;
