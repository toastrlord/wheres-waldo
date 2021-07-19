const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', imageSrc: 'wheres-waldo-beach.png', characters: ['Waldo', 'Odlaw'] });
});

router.get('/image:name', imageController.image_detail);

module.exports = router;
