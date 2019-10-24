var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");

//Comments new
// isLoggedIn - middle are -- if user logged in then only he /she can make comments
router.get("/new",isLoggedIn, function(req,res){
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
//comments create
router.post("/", isLoggedIn, function(req,res){
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
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//save comment
					comment.save();
					
					campground.comments.push(comment);
					campground.save();
					console.log(comment);
					res.redirect('/campgrounds/' + campground._id);
				}
			});
		}
	});
	
});

//Comment Edit Route
router.get("/:comment_id/edit", checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("back");
		} else{
			res.render("comments/edit", {campground_id : req.params.id, comment: foundComment});
		}
	});
	
});

//Comment update route
router.put("/:comment_id", checkCommentOwnership, function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment,{useFindAndModify : false}, function(err, updatedComment){
		if(err){
			res.redirect("back");
		}else {
			res.redirect("/campgrounds/" + req.params.id)
		}
	});
});

//Comment Destroy
router.delete("/:comment_id",checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

// miidle ware -- check comment ownership
function checkCommentOwnership(req,res,next){
	if(req.isAuthenticated()){
		
			Comment.findById(req.params.comment_id, function(err, foundComment){
				if(err){
					res.redirect("back");
				}
				else{
					//does user own the comment?
					if(foundComment.author.id.equals(req.user._id)){
						next();
						
					}
					else{
						res.redirect("back");
					}
					
				}
			});
	}
	else{
		res.redirect("back");
	}
}

module.exports = router;