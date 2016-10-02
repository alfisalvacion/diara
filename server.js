var express = require('express');
var morgan = require('morgan');
var consolidate = require('consolidate');
var bodyparser = require('body-parser');

// var promise = require('bluebird');
var options = {promiseLib: Promise};
var pgp = require('pg-promise')(options);
var connectionString = 'postgres://japheth:password@localhost:5432/diara';
var db = pgp(connectionString);

var app = express();

////////////////////////////////////////////////////////////////////////////////

app.listen(6660,function() {console.log('DIARA : Server Running!');});

////////////////////////////////////////////////////////////////////////////////

app.set('views', __dirname + '/views');
app.engine('html', consolidate.nunjucks);
app.use(morgan('dev'));
app.use(bodyparser.urlencoded({ extended: true }));
app.use('/static', express.static(__dirname + '/static'));

////////////////////////////////////////////////////////////////////////////////

app.get('/', function(req, res) {
  res.render('index.html');
});

app.post('/', function(req, res) {
  var u = req.body.username;
  var p = req.body.password;
  var data = {
    username: u,
    password: p
  }
  res.render('index.html', data);
});

////////////////////////////////////////////////////////////////////////////////

app.get('/signup', function(req, res) {
  res.render('signup.html');
});

app.post('/signup', function(req, res) {
  var id =        generateID('person');
  var firstname = req.body.firstname;
  var lastname =  req.body.lastname;
  var username =  req.body.username;
  var email =     req.body.email;
  var password =  req.body.password;
  db.none("insert into person "+
  "(id, first_name, last_name, username, email, password) "+
  "values("+id+",'"+firstname+"','"+lastname+"','"+username+"','"+email+"','"+password+"')")
  .then(function () {
    res.render('signup.html', {message: 'INSERTED!'});
  })
  .catch(function(err) {
    res.render('signup.html', {message: 'ERROR!'});
  });
});

////////////////////////////////////////////////////////////////////////////////

app.get('/changepassword', function(req, res) {
  res.render('changepass.html');
});

app.post('/changepassword', function(req, res) {
  var id = req.body.id;
  var op = req.body.oldpassword;
  var np1 = req.body.newpassword1;
  var np2 = req.body.newpassword2;
  db.one('select password from person where id='+id)
  .then(function (data) {
    if (data.password == op) {
      if (np1 == np2) {
        db.none('update person set password ');
      }
      else {
        res.render('signup.html', {message: 'WRONG PASSWORD COMBINATION!'});
      }
      res.render('signup.html', {message: 'INSERTED!'});
    }
    else {
      res.render('signup.html', {message: 'WRONG PASSWORD!'})
    }
  });
  res.render('changepass.html');
});

////////////////////////////////////////////////////////////////////////////////

function generateID(entity) {
  var id = 0;
  while (id == 0) {
    id = (new Date()).valueOf()-1475000000000;
    db.one('select count (*) from '+entity+' where id = $1', id)
    .then(function(data) {
      if (data) id = 0;
    });
  }
  return id;
}

function randomBetween(min,max) {
	return Math.floor((Math.random()*(max - min)+min));
}

////////////////////////////////////////////////////////////////////////////////
