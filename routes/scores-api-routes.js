var db = require("../models");

module.exports = function(app) {

	app.get("/api/scores", function(req, res) {
		var query = {};
		if (req.query.player_id) {
			query.UserId = req.query.player_id;
		}
		// Here we add an "include" property to our options in our findAll query
		// We set the value to an array of the models we want to include in a left outer join
		// In this case, just db.User
		db.User.findAll({
			where: query,
			include: [db.User, db.player_bank],
			order: [
				["player_bank", "DESC"] // Sorts by player_bank in decending order
			],
		}).then(function(dbUser) {
			res.json(dbUser);
		});
	});
};