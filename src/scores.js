$(document).ready(function () {
	var scoreList = $("scores");
	var scoresContainer = $(".scores-container");

	// Getting the initial list of Users
	getUsers();

	// Function for creating a new list row for each user
	function createUserRow(userData) {
		var newTr = $("<tr>");
		newTr.data("user", userData);
		newTr.append("<td>" + userData.player_username + "</td>");
		newTr.append("<td>" + userData.player_bank + "</td>");
	}

	// Function for retrieving users and getting them ready to be rendered to the page
	function getUsers() {
		$.get("/api/users", function (data) {
			var rowsToAdd = [];
			for (var i = 0; i < data.length; i++) {
				rowsToAdd.push(createUserRow(data[i]));
			}
			renderUserList(rowsToAdd);
		});
	}

	// A function for rendering the list of users to the page
	function renderUserList(rows) {
		scoreList.children().not(":last").remove();
		scoresContainer.children(".alert").remove();
		if (rows.length) {
			console.log(rows);
			scoreList.prepend(rows);
		} else {
			renderEmpty();
		}
	}

	// Function for handling what to render when there are no users
	function renderEmpty() {
		var alertDiv = $("<div>");
		alertDiv.addClass("alert alert-danger");
		alertDiv.text("There are no scores yet!");
		scoresContainer.append(alertDiv);
	}
});
