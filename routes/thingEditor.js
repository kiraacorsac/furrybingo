const express = require('express');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const Thing = mongoose.model('Thing');
const router = express.Router();


/* GET users listing. */
router.get('/', function (req, res, next) {
    Thing.find({})
        .populate()
        .then(function (things) {
                let subjects = things
                    .map(thing => thing.subjects)
                    .reduce((sub, subs) => sub.concat(subs), [])
                    .filter((value, index, self) => (self.indexOf(value) === index));
                res.render('thingEditor', {count: things.length, things: things, subjects: subjects});
            }
        );
});

router.post('/addThing', (req, res, next) => {
    let subjects = req.body.subjects.split(/[ ,]+/);
    Thing.create({
        text: req.body.text,
        subjects: (subjects.length === 0 || subjects[0] === "") ? [] : subjects,
        active: true
    }).then(function (things) {
        res.redirect('/thingEditor');
    });
});

router.post('/toggleThing', (req, res, next) => {
    Thing.findById(req.body.thingId)
        .exec()
        .then(thing => {
            thing.active = !thing.active;
            return thing.save()
        })
        .then(thing => res.redirect('/thingEditor'))
});

module.exports = router;
