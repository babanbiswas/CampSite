var mongoose = require("mongoose");
//SETUP SCHEMA
var campgroundSchema = new mongoose.Schema({
	name : String,
	image : String,
	description : String
});

// Compiling the schema into model
module.exports = mongoose.model("Campground", campgroundSchema);
