var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
//Get all the campgrounds from database
//INDEX route -- to show all campgrounds
router.get("/",function(req,res){
	
	
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
router.post("/",middleware.isLoggedIn, function(req,res){
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground = {name:name, price:price, image:image, description:description, author: author};
	
	// Add item to the database
	Campground.create(newCampground,function(err,newlyCreated){
		if(err){
			console.log(err);
		}
		else{
			console.log(newlyCreated);
			res.redirect("/campgrounds");
		}
	});
});

//NEW rote -- show form to create a new campground
router.get("/new", middleware.isLoggedIn, function(req,res){
	res.render("campgrounds/new");
});

//SHOW route  --- info about one campground
router.get("/:id", function(req,res){
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

//Edit campground
router.get("/:id/edit", middleware.checkCampgroundOwnership,function(req,res){
		Campground.findById(req.params.id, function(err, foundCampground){
			
			res.render("campgrounds/edit", {campground: foundCampground});
		});
	
});
//update campground
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	//find and update the correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground,{useFindAndModify:false}, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		}
		else{
			//redirect to shoe page
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
	
	
});

//Destroy Campgroud Route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndDelete(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		}
		else{
			res.redirect("/campgrounds");
		}
	});
});



module.exports = router;
