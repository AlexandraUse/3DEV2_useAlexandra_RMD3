/* jshint newcap: false */

var selfEnemy;
Polymer({

    points: 0,
    characterenemy: undefined,
    playerColor: undefined,
    team1: 0,
    team2: 0,

    ready: function(){
        selfEnemy = this;
    },
    onPlayersReady: function(players){
        selfEnemy.playerColor = playersColor;
        selfEnemy.characterImage = characterImgs;
    }
});