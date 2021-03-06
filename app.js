var express 		= require("express"),
	app 			= express(),
	bodyParser 		= require("body-parser"),
	mongoose 		= require("mongoose"),
	flash			= require("connect-flash"),
	passport 		= require("passport"),
	localStrategy 	= require("passport-local"),
	methodOverride  = require("method-override"),
	Campground 		= require("./models/campground"),
	seedDB 			= require("./seeds");

//requiring models
var Comment  = require("./models/comment"),
	 User    = require("./models/user");

//requiring routes
var commentRoutes  		=  require("./routes/comments"),
	campgroundRoutes	= require("./routes/campgrounds"),
	indexRoutes			= require("./routes/index");


// seedDB(); //seed the database
//mongoose.connect("mongodb://localhost/yelp_camp",{useNewUrlParser:true, useUnifiedTopology:true});
var dbstr = "mongodb+srv://babanbiswas:" + encodeURIComponent("Sept2019#") + "@cluster0-wegsi.mongodb.net/test?retryWrites=true&w=majority";
//mongoose.connect("mongodb://localhost/rest",{useNewUrlParser:true,useUnifiedTopology:true});
mongoose.connect(dbstr,{useNewUrlParser:true,
useUnifiedTopology:true,
useCreateIndex:true																												   }).then(() => {
	console.log("Connected to Database");
}).catch(err => {
	console.log("Error :",err.message);
});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//console.log(__dirname);




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
	res.locals.error	   = req.flash("error");
	res.locals.success	   = req.flash("success");
	next();
});

//for index routes "/" will be added in fron of every routes
app.use("/",indexRoutes);
//for campgroundRoutes "/campgrounds" will be added in front of every rotes
app.use("/campgrounds",campgroundRoutes);
//for commentRoutes "/campgrounds/:id/comments" will be added in front of every rotes
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(process.env.PORT||3000,process.env.IP,function(){
	console.log("Yelpcamp server has started");
});