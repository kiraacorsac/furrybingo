var mongoose = require('mongoose');

var BingoCardSchema = new mongoose.Schema({
    things: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BingoThing'
    }],
    won: Boolean,
    generatedOn: Date,
    generatedFor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('BingoCard', BingoCardSchema);