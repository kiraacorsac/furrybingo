var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    name: String,
    currentBingoCard: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BingoCard'
    }
});

module.exports = mongoose.model('User', UserSchema);