var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', imageSrc: 'wheres-waldo-beach.png', characters: ['Waldo', 'Odlaw'] });
});

module.exports = router;
