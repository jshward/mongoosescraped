var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// builds the article populations. that's not the right word... article databse entry? builds the article object. I like it
var Articleschema = new Schema({
	title: {
		type: String,
		required: true
	},
	link: {
		type: String,
		required: true
	},
	// `saved` is a boolean used to display the article in the raw, scraped section, or the saved articles.
	saved: {
		type: Boolean,
		default: false
	},
	// `note` is an object that stores a Note id
	// The ref property links the ObjectId to the Note model
	// This allows us to populate the Article with an associated Note
	notes: [
		{
			type: Schema.Types.ObjectId,
			ref: "Note"
		}
	]
});

// Creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", Articleschema);

// Export the Article model
module.exports = Article;