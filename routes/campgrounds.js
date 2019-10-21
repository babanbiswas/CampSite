var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
//Get all the campgrounds from database
//INDEX route -- to show all campgrounds
router.get("/campgrounds",function(req,res){
	
	
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
router.post("/campgrounds", function(req,res){
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
router.get("/campgrounds/new", function(req,res){
	res.render("campgrounds/new");
});

//SHOW route  --- info about one campground
router.get("/campgrounds/:id", function(req,res){
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

module.exports = router;
