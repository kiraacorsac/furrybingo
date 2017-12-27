var express = require('express');
var fs = require('fs');
var router = express.Router();

var files = function(){return fs.readdirSync('./')};
function createNewFile(filename) {
    fs.writeFileSync(filename, 'lisk');
}


/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('thingEditor', { title: "vagina", files: files() });
    next();
});


router.post('/', function(req, res, next) {
    var name = req.body.newFileName;
    createNewFile(name);
    res.render('thingEditor', { title: name, files: files() });
    next();

});

module.exports = router;
