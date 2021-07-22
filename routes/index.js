const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const async = require('async');
const fs = require('fs');
const path = require('path');
const url = require('url');
const { Rectangle, Circle } = require('../intersect');
const HighScore = require('../models/highScore');

const imageData = {};
fs.readdirSync('./imageData/').filter(file => file.endsWith('.json')).forEach(file => {
  const rawData = fs.readFileSync('./imageData/' + file);
  const jsonData = JSON.parse(rawData);
  const imageName = jsonData.name;
  imageData[imageName] = {};
  const currentImageData = imageData[imageName];
  currentImageData.characters = {};
  currentImageData.displayName = jsonData.displayName;
  jsonData.characters.forEach(characterData => {
    const {characterName, x1, y1, x2, y2} = characterData;
    const rect = new Rectangle(x1, y1, x2, y2);
    currentImageData.characters[characterName] = rect;
  });
});
console.log(imageData);

function validate(x, y, r, imageName, characterName) {
  const boundingRect = imageData[imageName].characters[characterName];
  const selectionCircle = new Circle(x, y, r);
  return boundingRect.intersect(selectionCircle);
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('main', { images: Object.keys(imageData), imageData });
});

router.get('/:image', function(req, res, next) {
  console.log('rendering image');
  res.render('index', { image: req.params.image, characters: Object.keys(imageData[req.params.image].characters) });
});

router.get('/:image/validate', function(req, res, next) {
  const {x, y, r, characterName} = req.query;
  const result = validate(x, y, r, req.params.image, characterName);

  res.status(200).send(result);
});

/*
router.post('/:image/score', [
  body('name', 'Please enter your name').trim().isLength({min: 1}).escape(),
  (req, res, next) => {
    const highScoreEntry = new HighScore({
      name: req.body.name,
      score: req.body.score,
      image: req.params.image
    });

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('/:image/score', { errors: errors.asArray() });
    }
    else {
      HighScore.create(highScoreEntry, function(err, theEntry) {
        if (err) { return next(err); }
        res.redirect('/');
      });
    }
  }
]);*/

module.exports = router;
