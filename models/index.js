// this should make it so the server.js file can use the models folder
module.exports = {
	Article: require("./Articles"),
	Note: require("./Notes")
};