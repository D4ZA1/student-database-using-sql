const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const session = require('express-session');


const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  secret: '12345612',
  resave: false,
  saveUninitialized: true
}));
app.use(express.static(__dirname));


const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Jaswanth84',
  database: 'login',
});

con.connect(function(err) {
  if (err) {
    throw err;
  }
  console.log('Connected to the MySQL database');
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});
app.get('/final', function(req, res) {
  res.sendFile(__dirname + "/home.html");
});


app.post('/validate', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  con.query('SELECT * FROM login_details WHERE email = ?', [email], (err, results) => {
    if (err) {
      throw err;
    }
    if (results.length === 0) {
      res.redirect('/?error=Invalid%20username');
    } else {
      isMatch=(password===results[0].password);
        if (err) {
          throw err;
        } 
        if (isMatch) {
          con.query('select * from marks where name = ?',[results[0].first_name] , function(err,resu){
            if(err){
              throw err;
            }
            else{
              req.session.column3 = resu;
              console.log('Query executed successfully. Result:', resu);
              req.session.column2 = results;
              res.redirect('/final');
            }
          })
          
          
          
        } else {
          res.redirect('/?error=Invalid%20password');
        }
    }

  });
});


app.get('/data', (req, res) => {
  const userData = (req.session.column2 || []).concat(req.session.column3 || []);
  console.log(" data  : " , userData);
  res.json(userData);
});


app.listen(port,'172.31.19.107',function() {
  console.log(`Server is running on port 172.31.19.107:  ${port}`);
});

/*app.listen(port,function() {
  console.log(`Server is running on port ${port}`);
});*/

