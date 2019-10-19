var mongoose = require("mongoose");
var Campground = require("./models/campground");

var data = [
	{
		name : "Sunny Night",
		image : "https://images.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
		description : "blah blah blah blah"
	},
	{
		name : "Distraction",
		image : "https://images.pexels.com/photos/1308881/pexels-photo-1308881.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
		description : "blah blah blah blah 2"
	},
	{
		name : "Look Behind",
		image : "https://images.pexels.com/photos/1386604/pexels-photo-1386604.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
		description : "blah blah blah blah 3"
	}
]
//Remove all campgrounds
function seedDB(){
	Campground.deleteMany({}, function(err){
		if(err){
			console.log(err);
		}else{
			console.log("removed campground");
			//Add a few campgrounds
			data.forEach(function(seed){
				Campground.create(seed, function(err, data){
					if(err){
						console.log(err);
					}else{
						console.log("Added a campground");
					}
				});
			});
		}
	});
}



module.exports = seedDB;
