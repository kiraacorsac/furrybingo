var mongoose = require('mongoose');

var ThingSchema = new mongoose.Schema({
    subjects: [String],
    text: String,
    active: Boolean
});

module.exports = mongoose.model('Thing', ThingSchema);