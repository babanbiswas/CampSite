var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
	{
		name : "Sunny Night",
		image : "https://images.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
		description : "In iaculis lobortis purus, nec pulvinar turpis laoreet eu. Morbi eget fringilla arcu. Fusce tempus purus non bibendum fermentum. Nunc ultrices enim in arcu hendrerit, vel luctus risus cursus. Aenean vehicula tortor nec nibh sollicitudin, id laoreet justo interdum. Phasellus nec consectetur erat. Maecenas tempor quis ex in euismod. Donec vel lacus eget lorem efficitur vulputate et vel lorem. Maecenas porta quam id velit rhoncus, iaculis maximus turpis aliquet. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Maecenas scelerisque ut nulla a pharetra. Ut mauris enim, iaculis eget dolor vel, porttitor lacinia mauris. Aenean vel erat dui. Nunc hendrerit tortor vitae sodales elementum. Nullam interdum massa sapien, at bibendum lectus bibendum ut."


	},
	{
		name : "Distraction",
		image : "https://images.pexels.com/photos/1308881/pexels-photo-1308881.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
		description : "In iaculis lobortis purus, nec pulvinar turpis laoreet eu. Morbi eget fringilla arcu. Fusce tempus purus non bibendum fermentum. Nunc ultrices enim in arcu hendrerit, vel luctus risus cursus. Aenean vehicula tortor nec nibh sollicitudin, id laoreet justo interdum. Phasellus nec consectetur erat. Maecenas tempor quis ex in euismod. Donec vel lacus eget lorem efficitur vulputate et vel lorem. Maecenas porta quam id velit rhoncus, iaculis maximus turpis aliquet. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Maecenas scelerisque ut nulla a pharetra. Ut mauris enim, iaculis eget dolor vel, porttitor lacinia mauris. Aenean vel erat dui. Nunc hendrerit tortor vitae sodales elementum. Nullam interdum massa sapien, at bibendum lectus bibendum ut."


	},
	{
		name : "Look Behind",
		image : "https://images.pexels.com/photos/1386604/pexels-photo-1386604.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
		description : "In iaculis lobortis purus, nec pulvinar turpis laoreet eu. Morbi eget fringilla arcu. Fusce tempus purus non bibendum fermentum. Nunc ultrices enim in arcu hendrerit, vel luctus risus cursus. Aenean vehicula tortor nec nibh sollicitudin, id laoreet justo interdum. Phasellus nec consectetur erat. Maecenas tempor quis ex in euismod. Donec vel lacus eget lorem efficitur vulputate et vel lorem. Maecenas porta quam id velit rhoncus, iaculis maximus turpis aliquet. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Maecenas scelerisque ut nulla a pharetra. Ut mauris enim, iaculis eget dolor vel, porttitor lacinia mauris. Aenean vel erat dui. Nunc hendrerit tortor vitae sodales elementum. Nullam interdum massa sapien, at bibendum lectus bibendum ut."


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
				Campground.create(seed, function(err, campground){
					if(err){
						console.log(err);
					}else{
						console.log("Added a campground");
						//Create a comment
						Comment.create(
						{
							text : "Awsome place",
							author : "Baban"
						}, function(err, comment){
								if(err){
									console.log(err);
								}else{
									campground.comments.push(comment);
									campground.save();
									console.log("Created new comment");
								}
							}
						);
					}
				});
			});
		}
	});
}



module.exports = seedDB;
