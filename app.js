var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var seedDB = require("./seeds");

var Comment = require("./models/comment");

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
			res.render("campgrounds/index", {campgrounds:allCampgrounds});
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
app.get("/campgrounds/:id/comments/new", function(req,res){
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
app.post("/campgrounds/:id/comments", function(req,res){
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

app.listen(process.env.PORT||3000,process.env.IP,function(){
	console.log("Yelpcamp server has started");
});