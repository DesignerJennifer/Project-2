DROP DATABASE IF EXISTS blackjackApp;

CREATE DATABASE blackjackApp;

USE blackjackApp;

CREATE TABLE play_tbl(  
   player_id INT NOT NULL AUTO_INCREMENT,  
   player_username VARCHAR(100) NOT NULL,  
   player_bank VARCHAR(100) NOT NULL,  
   PRIMARY KEY ( player_id )  
);

INSERT INTO play_tbl (player_id, player_username, player_bank)
VALUES (1, "matt" , 100);

INSERT INTO play_tbl (player_id, player_username, player_bank)
VALUES (2, "jennifer", 120);

INSERT INTO play_tbl (player_id, player_username, player_bank)
VALUES (3, "john", 75);
