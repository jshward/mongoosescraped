
var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new NoteSchema object
var Noteschema = new Schema({
	title: String,
	body: String
});

// Creates our model from the above schema, using mongoose's model method
var Note = mongoose.model("Note", Noteschema);

// Export the Note model
module.exports = Note;