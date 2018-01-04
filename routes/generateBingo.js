var express = require("express");
var Shuffle = require('shuffle');
var mongoose = require('mongoose');
var Promise = require("bluebird");
var User = mongoose.model('User');
var BingoCard = mongoose.model('BingoCard');
var BingoThing = mongoose.model('BingoThing');
var Thing = mongoose.model('Thing');

var router = express.Router();


function getRenderableCardArray(user) {
    var bingoCardArray = user.currentBingoCard.things;
    return bingoCardArray.map(function (bingoThing) {
        return {
            text: bingoThing.thing.text,
            complete: bingoThing['complete'] //i accidentally shadowing
        }
    });
}

function createNewCard(bingoThings, user) {
    return BingoThing.create(bingoThings)
        .then(function (completedBingoThings) {
                return BingoCard.create({
                    things: completedBingoThings,
                    won: false,
                    generatedOn: new Date().getTime(),
                    generatedFor: user
                })
            }
        )
}


function makeNewBingoCard(user, things) {
    return Promise.all([things, user])
        .then(function (res) {
            var bingoThings = res[0].map(function (thing) {
                return {thing: thing, complete: false}
            });
            return createNewCard(Shuffle.shuffle({deck: bingoThings}).draw(25), res[1]);
        })
}

router.post('/generateNew', function (req, res, next) {
    var user = User.findOne({name: req.body.user}).exec();
    var things = Thing.find({subjects: {$ne: req.body.user}}).exec();
    var card = makeNewBingoCard(user, things);

    Promise.all([user, card]).then(function (ret) {
        ret[0].currentBingoCard = ret[1];
        return ret[0].save();
    }).then(function (user) {
        res.render('generateBingo', {bingoCardArray: getRenderableCardArray(user)});
    }).catch(function (err) {
        res.render('index', {title: err});
    });


});

router.post('/show', function (req, res, next) {
    User.findOne({name: req.body.user})
        .populate({
            path: 'currentBingoCard',
            populate: {
                path: 'things',
                populate: {
                    path: 'thing'
                }
            }
        })
        .exec()
        .then(function (user) {
            res.render('generateBingo', {bingoCardArray: getRenderableCardArray(user)});
        });

});

router.get('/', function (req, res, next) {
    res.render('generateBingo', {
        bingoCardArray: Array(26).join('a').split('')
    });
});


module.exports = router;
