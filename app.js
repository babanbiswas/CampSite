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
app.get("/", function(req,res){
	res.render("landing");
});

//Get all the campgrounds from database
//INDEX route -- to show all campgrounds
app.get("/campgrounds",function(req,res){
	
	
	Campground.find({},function(err,allCampgrounds){
		if(err){
			console.log(err);
		}
		else{
			res.render("campgrounds/index", {campgrounds:allCampgrounds, currentUser : req.user});
		}
	});
	
});

//CREATE rote  -- Add new campground to db
app.post("/campgrounds", function(req,res){
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var newCampground = {name:name, image:image, description:description};
	// Add item to the database
	Campground.create(newCampground,function(err,newlyCreated){
		if(err){
			console.log(err);
		}
		else{
			res.redirect("/campgrounds");
		}
	});
});

//NEW rote -- show form to create a new campground
app.get("/campgrounds/new", function(req,res){
	res.render("campgrounds/new");
});

//SHOW route  --- info about one campground
app.get("/campgrounds/:id", function(req,res){
	//Find campground with provided id
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		}else{
			//console.log(foundCampground);
			//render show template with that campground
			res.render("campgrounds/show",{campground:foundCampground});
		}
	});
	
});

//Comments Route
//==========================

//Create Route -- comment create
// isLoggedIn - middle are -- if user logged in then only he /she can make comments
app.get("/campgrounds/:id/comments/new",isLoggedIn, function(req,res){
	//find campground by id
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		}else{
			res.render("comments/new",{campground:campground});
		}
	});
	
});
	
//Post route -- Comment will posted here
app.post("/campgrounds/:id/comments", isLoggedIn, function(req,res){
	//Lookup campground using ID
	Campground.findById(req.params.id,function(err, campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}else{
			Comment.create(req.body.comment,function(err, comment){
				if(err){
					console.log(err);
				}else{
					campground.comments.push(comment);
					campground.save();
					res.redirect('/campgrounds/' + campground._id);
				}
			});
		}
	});
	//create new comment
	
	//connect new comment to campground
	
	//redirect campground show page
});

//================================
//AUTH ROUTES
//=================================
//show register form
app.get("/register", function(req,res){
	res.render("register");
});

//Handling sign up logic
app.post("/register", function(req,res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/campgrounds");
		});
	});
});

//Log In Route
//render login form
app.get("/login", function(req, res){
	res.render("login");
});

//login logic
app.post("/login",passport.authenticate("local",{
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}), function(req,res){
	
});

//logout route
app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/campgrounds");
});

//If logged in then onlyuser can make comments -- middleware
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

app.listen(process.env.PORT||3000,process.env.IP,function(){
	console.log("Yelpcamp server has started");
});