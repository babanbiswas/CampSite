var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");

//Comments Route
//==========================

//Create Route -- comment create
// isLoggedIn - middle are -- if user logged in then only he /she can make comments
router.get("/campgrounds/:id/comments/new",isLoggedIn, function(req,res){
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
router.post("/campgrounds/:id/comments", isLoggedIn, function(req,res){
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
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router;