const express = require("express");
const Shuffle = require('shuffle');
const mongoose = require('mongoose');
const Promise = require("bluebird");

const User = mongoose.model('User');
const BingoCard = mongoose.model('BingoCard');
const BingoThing = mongoose.model('BingoThing');
const Thing = mongoose.model('Thing');

const router = express.Router();


function getRenderableCardArray(user) {
    let bingoCardArray = user.currentBingoCard.things;
    return bingoCardArray.map(
        bingoThing => ({
            text: bingoThing.thing.text,
            id: bingoThing.id,
            complete: bingoThing['complete'] //i accidentally shadowing
        })
    );
}

function getPopulatedUserDocument(user) {
    return User.findOne({name: user})
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
}



router.post('/toggle', (req, res, next) => {
    let user = req.body.user;
    BingoThing.findById(req.body.thingId)
        .exec()
        .then(bingothing => {
            bingothing.complete = !bingothing.complete;
            return bingothing.save();
        }).then(bingothing => res.redirect('/showBingo/show?user='+user));
});


router.get('/show', (req, res, next) => {
    getPopulatedUserDocument(req.query.user)
        .then(
            user => {
                res.render('showBingo', {
                    renderCard: true,
                    bingoCardArray: getRenderableCardArray(user),
                    user: user.name
                })
            }
        );
});

router.get('/show', (req, res, next) => {
    getPopulatedUserDocument(req.query.user)
        .then(
            user => {
                res.render('showBingo', {
                    renderCard: true,
                    bingoCardArray: getRenderableCardArray(user),
                    user: user.name
                })
            }
        );
});

router.get('/', (req, res, next) => {
    res.render('showBingo', {
        renderCard: false
    });
});


module.exports = router;
