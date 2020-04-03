# Project-2
 
# Contributors - Kellen, Jennifer, Matt, John
 
## User Story:
As a blackjack player, I want an app I can play, so that I can relax and practice my favorite game.

## Descripton:
This blackjack app was designed to let anyone play blackjack. You can add your name and start playing! Don’t know how to play? Don’t worry, there is a ‘Rules’ section that will teach you how. You can place different bets and try to beat the dealer. When you’re done you can see your name added to the leaderboard in the ‘Scores’ section!
 
## Features
Landing page
Play page including hit, stand, double down
Rules page
Scores page
 
## Code Example
    doubleDown = () => {
        document.querySelector("#double-down").disabled = true;
        let double = this.bet * 2;
        if (double < this.Human.chips) {
            this.bet = double;
        } else {
            this.bet = this.Human.chips;
        }
        $("#betText").text(`Your current bet: ${this.bet}`);
        this.runPlayerTurn();
        this.endPlayerTurn();
    };
 
 
 
## How to use?
To start game play click ‘Start’ and add your name. You will then be taken to the play page. This will allow you to actually play the game. If you don’t know the rules or want to brush up on them you can click on ‘Rules’. And finally, to see high scores you click on ‘High Scores’.



## Links

Repository: https://github.com/DesignerJennifer/Project-2