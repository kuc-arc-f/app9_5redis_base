var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const flash = require('express-flash');
var session = require('express-session');

//
var indexRouter = require('./routes/index');
var userRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var tasksRouter = require('./routes/tasks');
var reactTasksRouter = require('./routes/react_tasks');
//api
var apiRouter = require('./routes/api');

var app = express();
const expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(cookieParser('keyboard cat'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next){
  next();
});
// CSRF
//express-sessionモジュールを設定する
app.use(session({
  //暗号化に利用するキーを設定
  secret: 'secret key',
  //毎回セッションを作成しない
  resave: false,
  //未初期化状態のセッションを保存しない
  saveUninitialized: false,
  cookie: {
    //生存期間( msec )
    maxAge: 365 * 24 * 60 * 1000,
    //httpsを使用しない
    secure: false
  }
}));
app.use(flash());

// route
app.use('/', indexRouter);
app.use('/users', userRouter );
app.use('/login', loginRouter );
app.use('/tasks', tasksRouter );
app.use('/react_tasks', reactTasksRouter );
// api
app.use('/api', apiRouter);

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
