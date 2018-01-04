var mongoose = require('mongoose');

var BingoThingSchema = new mongoose.Schema({
    thing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Thing'
    },
    complete: Boolean
});

module.exports = mongoose.model('BingoThing', BingoThingSchema);