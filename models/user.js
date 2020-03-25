module.exports = function (sequelize, DataTypes) {
	var User = sequelize.define("User", {
		player_username: {
			type: DataTypes.STRING,
			// AllowNull is a flag that restricts a username from being entered if it doesn't
			// have a text value
			allowNull: false,
			// len is a validation that checks that our username is between 1 and 30 characters
			validate: {
				len: [1, 30]
			}
		},
		player_bank: {
			type: DataTypes.INTEGER,
			// defaultValue is a flag that defaults a new player_bank with 100
			defaultValue: 100
		}
	});
	return User;
};
