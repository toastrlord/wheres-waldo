const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const async = require('async');
const fs = require('fs');
const path = require('path');
const url = require('url');
const { Rectangle, Circle } = require('../intersect');

const imageData = {};
fs.readdirSync('./imageData/').filter(file => file.endsWith('.json')).forEach(file => {
  const rawData = fs.readFileSync('./imageData/' + file);
  const jsonData = JSON.parse(rawData);
  const imageName = jsonData.name;
  imageData[imageName] = {};
  const currentImageData = imageData[imageName];
  jsonData.characters.forEach(characterData => {
    const {characterName, x1, y1, x2, y2} = characterData;
    const rect = new Rectangle(x1, y1, x2, y2);
    currentImageData[characterName] = rect;
  });
});

function validate(x, y, r, imageName, characterName) {
  const boundingRect = imageData[imageName][characterName];
  const selectionCircle = new Circle(x, y, r);
  return boundingRect.intersect(selectionCircle);
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/beach');
});

router.get('/beach', function(req, res, next) {
  res.render('index', { imageSrc: 'wheres-waldo-beach.png', characters: ['Waldo', 'Odlaw'] });
});

router.get('/:image/validate', function(req, res, next) {
  const {x, y, r, characterName} = req.query;
  const result = validate(x, y, r, req.params.image, characterName);

  res.status(200).send(result);
});

module.exports = router;
