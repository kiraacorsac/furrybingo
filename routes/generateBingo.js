const express = require("express");
const Shuffle = require('shuffle');
const mongoose = require('mongoose');
const Promise = require("bluebird");

const User = mongoose.model('User');
const BingoCard = mongoose.model('BingoCard');
const BingoThing = mongoose.model('BingoThing');
const Thing = mongoose.model('Thing');

const router = express.Router();


function createNewCard(bingoThings, user) {
    return BingoThing.create(bingoThings)
        .then(completedBingoThings =>
            BingoCard.create({
                things: completedBingoThings,
                won: false,
                generatedOn: new Date().getTime(),
                generatedFor: user
            })
        )
}


function makeNewBingoCard(user, things) {
    return Promise.all([user, things])
        .then(([user, things]) => {
            if(things.length < 25){
                throw new Error("Selected subjects do not provide enough things (need 25, have only" + things.length + ").");
            }
            let bingoThings = things.map(
                thing => ({thing: thing, complete: false})
            );
            return createNewCard(Shuffle.shuffle({deck: bingoThings}).draw(25), user);
        });
}

router.post('/', (req, res, next) => {
    //nin for all but selected
    //all for selected
    let userIds = req.body.users.map(user => mongoose.Types.ObjectId(user));
    let userQueryChoices = {
        everyone: {},
        onlySelected: {_id: {$in: userIds}}
    };

    User.find(userQueryChoices[req.body.generateFor])
        .exec()
        .then((users) => Promise.all(
            users.map(user => {
                    let subjects = req.body.subjects != null ? req.body.subjects : [];
                    let subjectQueryChoices = {
                        everyone: {
                            subjects: {$ne: user.name},
                            active: true
                        },
                        onlySelected: {
                            subjects: {
                                $ne: user.name,
                                $not: {$elemMatch: {$nin: subjects}} //yeah I just copied it from stackoverflow
                            },
                            active: true
                        },
                        everyoneButSelected: {
                            subjects: {
                                $ne: user.name,
                                $nin: subjects
                            },
                            active: true
                        }
                    };


                    let things = Thing.find(subjectQueryChoices[req.body.generateFrom]).exec();
                    let card = makeNewBingoCard(user, things);

                    return Promise.all([user, card])
                        .then(([user, card]) => {
                            user.currentBingoCard = card;
                            return user.save();
                        });
                }
            )
        ))
        .then(result =>{
            res.redirect("/generateBingo")
        })
        .catch(err => res.render('index', {title: err, msg: err}));
    /*
    then(user =>
        res.render('showBingo', {
            renderCard: true,
            bingoCardArray: getRenderableCardArray(user),
            user: user.name
        })
    ).catch(err => res.render('index', {title: err}));*/
});

router.get('/', (req, res, next) => {
    let users = User.find({})
        .exec();
    let things = Thing.find({})
        .populate()
        .exec();
    Promise.all([things, users])
        .then(([things, allUsers]) => {
            let allSubjects = things
                .map(thing => thing.subjects)
                .reduce((sub, subs) => sub.concat(subs), [])
                .filter((value, index, self) => (self.indexOf(value) === index));

            res.render('generateBingo', {
                allUsers: allUsers,
                allSubjects: allSubjects
            })
        })
});

module.exports = router;