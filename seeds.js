var mongoose = require("mongoose");
var Campground = require("./models/campground");

function seedDB(){
	Campground.deleteMany({}, function(err){
		if(err){
			console.log(err);
		}else{
			console.log("removed campground");
		}
	});
}

module.exports = seedDB;
