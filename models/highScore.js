const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HighScoreSchema = new Schema(
    {
        name: {type: String, required: true, maxLength: 25},
        score: {type: Number, required: true},
        image: {type: String}
    }
);

module.exports = mongoose.model('HighScore', HighScoreSchema);