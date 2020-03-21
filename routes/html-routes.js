var path = require("path");

// Routes
// =============================================================
module.exports = function(app) {
	// Each of the below routes just handles the HTML page that the user gets sent to.

	// index route loads index.html
	app.get("/", function(req, res) {
		res.sendFile(path.join(__dirname, "../public/index.html"));
	});

	// play route loads play.html
	app.get("/play", function(req, res) {
		res.sendFile(path.join(__dirname, "../public/play.html"));
	});

	// scores route loads scores.html
	app.get("/scores", function(req, res) {
		res.sendFile(path.join(__dirname, "../public/scores.html"));
	});
};
