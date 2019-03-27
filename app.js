// Setup
var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));


const { Pool,Client } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on('connect', () => {
  console.log('connected to the db');
});

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


// Routes
app.get("/", (req, res) => {

	var out = res;
	pool.query("SELECT * FROM blog", (err, res) => {
	  if (err) {
	    console.log(err.stack);
	  } else {
	    console.log(res.rows);
			out.render('index', {posts:res.rows});
	  }
	});

});

app.post('/addpost', (req, res) => {
	var out = res;
	const query = {
  text: 'INSERT INTO blog(body, title, date) VALUES($1, $2, $3)',
  values: [req.body.body, req.body.title, new Date(Date.now()).toLocaleString()],
	}

	pool.query(query, (err, res) => {
	  if (err) {
	    console.log(err.stack);
			out.status(400).send("Unable to save data");
	  } else {
			console.log(res.rows[0]);
			out.redirect('/');
	  }
	})
});

// Listen
app.listen(process.env.PORT || 3000, () => {
	console.log('Server listing');
    });
