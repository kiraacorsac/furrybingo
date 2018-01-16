const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Thing = require('./models/Thing');
const BingoThing = require('./models/BingoThing');
const BingoCard = require('./models/BingoCard');
const User = require('./models/User');

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const index = require('./routes/index');
const thingEditor = require('./routes/thingEditor');
const newUser = require('./routes/newUser');
const showBingo = require('./routes/showBingo');
const generateBingo = require('./routes/generateBingo')

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MLAB_FURRYBINGO_CS, {
    useMongoClient: true
});


app.use('/', index);
app.use('/thingEditor', thingEditor);
app.use('/newUser', newUser);
app.use('/showBingo', showBingo);
app.use('/generateBingo', generateBingo);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
