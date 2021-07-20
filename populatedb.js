#! /user/bin/env node

console.log('This script will populate the database with test data');

var userArgs = process.argv.slice(2);

var async = require('async');
var Image = require('./models/image');

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
console.log(mongoDB);
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var images = [];

function imageCreate(name, characters) {
    var imageDetail = {name, characters};
    var image = new Image(imageDetail);

    image.save(function (err) {
        if (err) {
            cb(err, null);
            return;
        }
        console.log('New Image: ' + image);
        images.push(image);
        cb(null, item);
    });
}

function createCharacter(characterName, x1, y1, x2, y2) {
    return {characterName, x1, y1, x2, y2};
}

function createAllImages(cb) {
    async.parallel([
        imageCreate('beach', '')
    ], function(err, results) {
        if (err) {
            console.log('FINAL ERR: ' + err);
        }
        else {
            console.log('IMAGES: ' + images);
        }
        mongoose.connection.close();
    });
}

