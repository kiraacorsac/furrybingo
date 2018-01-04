var express = require('express');
var mongoose = require('mongoose');
var Promise = require('bluebird');
var Thing = mongoose.model('Thing');
var router = express.Router();

var find = function (res) {
    var things = Thing.find({})
        .populate()
        .then(function (things) {

                res.render('thingEditor', {count: things.length, things: things});
            }
        );
};

/* GET users listing. */
router.get('/', function (req, res, next) {
    find(res);
});

router.post('/', function (req, res, next) {
    var subjects = req.body.subjects.split(/[ ,]+/);
    Thing.create({
        text: req.body.text,
        subjects: (subjects.length === 0 || subjects[0] === "") ? [] : subjects,
        active: true
    }).then(function (things) {
        res.redirect('/thingEditor');
    }).catch(function (reason) {
        console.log(reason);
    })
});

module.exports = router;
