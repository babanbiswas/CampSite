var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var localStrategy = require("passport-local");
var Campground = require("./models/campground");
var seedDB = require("./seeds");

var Comment = require("./models/comment");
var User    = require("./models/user");


var commentRoutes  		=  require("./routes/comments"),
	campgroundRoutes	= require("./routes/campgrounds"),
	indexRoutes			= require("./routes/index");


seedDB();
mongoose.connect("mongodb://localhost/yelp_camp",{useNewUrlParser:true, useUnifiedTopology:true});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
console.log(__dirname);


//Campground.create({
	//name:"Dodabeta Top",
	//image:"https://pixabay.com/get/57e8d1454b56ae14f6da8c7dda793f7f1636dfe2564c704c73267bd1904bc15a_340.jpg"
//},
//function(err,Campground){
	//if(err){
		//console.log(err);
	//}
	//else{
		//console.log("Newly added campground :");
		//console.log(Campground);
	//}
//});

// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret : "I can do anything by hardwork only and blessing from parents and god",
	resave : false,
	saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());	

// middle ware -- to add currentUser to every route
app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	next();
});

app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

app.listen(process.env.PORT||3000,process.env.IP,function(){
	console.log("Yelpcamp server has started");
});