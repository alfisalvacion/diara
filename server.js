var express = require('express');
var morgan = require('morgan');
var consolidate = require('consolidate');
var bodyparser = require('body-parser');

var options = {promiseLib: Promise}; // Promise is a default lib in js, just like Math
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
  db.none("insert into person (id, first_name, last_name, username, email, password) "+
  "values("+id+",'"+firstname+"','"+lastname+"','"+username+"','"+email+"','"+password+"')")
    .then(function() {
      res.render('signup.html');
    })
    .catch(function(error) {
      console.log('ERROR IN SIGNUP : ' + error);
      res.render('signup.html');
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
    .then(function(data) {
      if (data.password == op) {
        if (np1 == np2) {
          db.none("update person set password='"+np1+"' where password='"+op+"' and id="+id);
          res.render('changepass.html');
        }
        else {
          throw 'NEW PASSWORDS DOES NOT MATCH!';
        }
      }
      else {
        throw 'WRONG PASSWORD!';
      }
    })
    .catch(function(error) {
      console.log('ERROR IN CHANGEPASSWORD : ' + error);
      res.render('changepass.html');
    });
});
////////////////////////////////////////////////////////////////////////////////
app.get('/createproject', function(req, res) {
  res.render('createproject.html');
});
app.post('/createproject', function(req, res) {
  var id =            generateID('project');
  var creatorid =     req.body.creatorid;
  var description =   req.body.description;
  var createdate =    req.body.createdate;
  var deadline =      req.body.deadline;
  db.none("insert into project (id, user_id, description, create_date, deadline) "+
  "values("+id+","+creatorid+",'"+description+"','"+createdate+"','"+deadline+"')")
    .then(function() {
      res.render('createproject.html');
    })
    .catch(function(error) {
      console.log('ERROR IN CREATE PROJECT : ' + error);
      res.render('createproject.html');
    });
});
////////////////////////////////////////////////////////////////////////////////
app.get('/createteam', function(req, res) {
  res.render('createproject.html');
});
app.post('/createteam', function(req, res) {
  var id =            generateID('team');
  var creatorid =     req.body.creatorid;
  var projectid =     req.body.projectid;
  var teamid =        req.body.teamid;
  var createdate =    req.body.createdate;
  var name =          req.body.name;
  var description =   req.body.description;
  db.none("insert into team (id, user_id, project_id, team_id, create_date, name, description) "+
  "values("+id+","+creatorid+","+projectid+","+teamid+",'"+createdate+"','"+name+"','"+description+"')")
    .then(function() {
      res.render('createteam.html');
    })
    .catch(function(error) {
      console.log('ERROR IN CREATE TEAM : ' + error);
      res.render('createteam.html');
    });
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
