// Setup
var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));


var mongoose = require("mongoose-sql");

// Create connection: note default environment variables
// returns a Knex instance
mongoose.connect({
    client: "pg",
    connection : process.env.DATABASE_URL,
},function(err) {
  // If no error, successfully connected
	console.log("connected" + err);
});


var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

var postSchema = new mongoose.Schema({ title: String, body: String, date: String });
var Post = mongoose.model('Post', postSchema);



// Routes
app.get("/", (req, res) => {
	Post.find({}, (err, posts) => {
		console.log(posts);
		res.render('index', { posts: posts})
	});
});

app.post('/addpost', (req, res) => {
	var postData = new Post(req.body);
	postData.date = new Date(Date.now()).toLocaleString();
	postData.save().then( result => {
		res.redirect('/');
	}).catch(err => {
		    res.status(400).send("Unable to save data");
		});
		});

// Listen
app.listen(process.env.PORT || 3000, () => {
	console.log('Server listing on 3000');
    });
