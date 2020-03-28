/* eslint-disable no-mixed-spaces-and-tabs */
$(document).ready(function () {
	var player_usernameInput = $("#playerName");
	var scoreList = $("scores");
	var scoresContainer = $("#scores-container");

	$(document).on("submit", "#user-form", handleUserFormSubmit);
	// Getting the initial list of Users
	getUsers();

	function handleUserFormSubmit(event) {
		event.preventDefault();
		// Don't do anything if the name fields hasn't been filled out
		if (!player_usernameInput.val().trim().trim()) {
			return;
		}
		// Calling the upsertUser function and passing in the value of the name input
		upsertUser({
			player_username: player_usernameInput
				.val()
				.trim(),
		});
	}

	    // A function for creating an user. Calls getUsers upon completion
	function upsertUser(UserData) {
		$.post("/api/scores", UserData)
			.then(getUsers);
	}

	// Function for creating a new list row for each user
	function createUserRow(userData) {
		var newTr = $("<tr>");
		newTr.data("user", userData);
		newTr.append("<td>" + userData.player_username + "</td>");
		newTr.append("<td>" + userData.player_bank + "</td>");
	}

	// Function for retrieving users and getting them ready to be rendered to the page
	function getUsers() {
		$.get("/api/scores", function (data) {
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
