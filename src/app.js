var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

/* --- [ADD NEW PAGE - INCLUDE ROUTER HERE] --- */
var indexRouter = require('./routes/index');
var scriptingRouter = require('./routes/scripting');	// template for running python script
var monitorRouter = require('./routes/monitor');
var nearbyAppRouter = require('./routes/nearbyApp');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));	// Body Parser Init (For POST methods)
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* --- [ADD NEW PAGE - ADD THE ROUTER HERE]--- */
app.use('/', indexRouter);
app.use('/scripting', scriptingRouter); 				// template for running python script
app.use('/monitor', monitorRouter);
app.use('/nearbyApp', nearbyAppRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
