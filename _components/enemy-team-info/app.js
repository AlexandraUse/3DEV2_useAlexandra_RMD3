/* jshint newcap: false */

var selfEnemy;
Polymer({

    points: 0,
    characterenemy: undefined,
    playerColor: undefined,
    team1: undefined,
    team2: undefined,

    ready: function(){
        selfEnemy = this;
    },
    onPlayersReady: function(players){
        selfEnemy.playerColor = playersColor;
        selfEnemy.characterImage = characterImgs;
    }
});