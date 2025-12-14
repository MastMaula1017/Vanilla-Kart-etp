const express = require('express');
const router = express.Router();
const { submitQuestion } = require('../controllers/questionController');

router.post('/', submitQuestion);

module.exports = router;
