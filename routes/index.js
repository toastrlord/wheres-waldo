const express = require('express');
const router = express.Router();
const async = require('async');
const fs = require('fs');
const path = require('path');
const url = require('url');
const { Rectangle, Circle } = require('../intersect');
const {body, validationResult} = require('express-validator');
const HighScore = require('../models/highScore');
let currentScore = 0;

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

function validate(x, y, r, imageName, characterName, score) {
  const boundingRect = imageData[imageName].characters[characterName];
  const selectionCircle = new Circle(x, y, r);
  currentScore = score;
  return boundingRect.intersect(selectionCircle);
}

/* GET home page. */
router.get('/', function(req, res, next) {
  HighScore.find({}).sort([['score', 'ascending']]).exec(function(err, scores) {
    if (err) { 
      res.render('main', { images: Object.keys(imageData), imageData});
    }
    res.render('main', { images: Object.keys(imageData), imageData, scores });
  });
});

router.get('/:image/score', function(req, res, next) {
  HighScore.find({image: req.params.image})
  .sort([['score', 'ascending']])
  .exec(function(err, scores) {
    if (err) { next(err); }
    res.render('scores', {scores, image: req.params.image, imageName: imageData[req.params.image].displayName, newScoreID: req.query.newScoreID});
  });
});

router.get('/:image', function(req, res, next) {
  res.render('index', { image: req.params.image, imageName: imageData[req.params.image].displayName, characters: Object.keys(imageData[req.params.image].characters) });
});

router.get('/:image/validate', function(req, res, next) {
  const {x, y, r, characterName, score} = req.query;
  const result = validate(x, y, r, req.params.image, characterName, score);

  res.status(200).send(result);
});

router.post('/:image', [
  body('name', 'Please enter your name').trim().isLength({min: 1}).withMessage('Please enter your name').escape(),
  (req, res, next) => {
    const highScoreEntry = new HighScore({
      name: req.body.name,
      score: currentScore,
      image: req.params.image
    });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('index', { score: currentScore, errors: errors.array(), image: req.params.image, imageName: imageData[req.params.image].displayName, characters: Object.keys(imageData[req.params.image].characters)});
    }
    else {
      HighScore.create(highScoreEntry, function(err, theEntry) {
        if (err) { return next(err); }
        res.redirect('/' + req.params.image + '/score/' + '?newScoreID=' + theEntry._id);
      });
    }
  }
]);

module.exports = router;
