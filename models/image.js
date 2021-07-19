const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema(
    {
        name: {type: String, required: true, maxLength: 25},
        characters: [{
            characterName: {type: String},
            x1: {type: Number},
            y1: {type: Number},
            x2: {type: Number},
            y2: {type: Number},
        }],
    }
);

ImageSchema
.virtual('url')
.get(function() {
    return '/image/' + this.name;
});

ImageSchema
.virtual('imageSource')
.get(function() {
    return '/images/' + this.name + 'png';
});

module.exports = mongoose.model('Image', ImageSchema);