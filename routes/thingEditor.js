var express = require('express');
var fs = require('fs');
var router = express.Router();

var files = fs.readdirSync('./');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('thingEditor', { title: "vagina", files: files });
});

module.exports = router;
