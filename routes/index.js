const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const async = require('async');
const fs = require('fs');
const path = require('path');

let currentImageData;

fs.readdir('./imageData/', (err, files) => {
  if (err) {
    throw err;
  }
  console.log(files);
}, (err, files) => {
  if (err) {
    throw err;
  } else { 
    console.log(files);
    console.log('done reading .json files');
  }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', imageSrc: 'wheres-waldo-beach.png', characters: ['Waldo', 'Odlaw'] });
});

//router.get('/image:name', imageController.image_detail);

module.exports = router;
