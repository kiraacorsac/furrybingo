var express = require('express');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var router = express.Router();

var find = function (res) {
    User.find({}, function (err, Users) {
            res.render('newUser', { count: Users.length, users: Users });
        }
    );
};

/* GET users listing. */
router.get('/', function(req, res, next) {
    find(res);
});

router.post('/', function (req, res, next) {
    User.create({
        name: req.body.name,
        currentBingoCard: null
    }, function (err, Users) {
        find(res);
    })
});

module.exports = router;
