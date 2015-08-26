/* jshint newcap: false */

function startHandlerEnemy(data){
    if(this.characterenemy != null){
        console.log("Enemy team info: " + " Enemy character = " + this.characterenemy);
    }
}

function enemyAddPointsHandler(point){
}

var selfEnemy;
Polymer({

    points: 0,
    characterenemy: undefined,
    playerColor: undefined,

    ready: function(){
        selfEnemy = this;
    },
    onPlayersReady: function(players){
        selfEnemy.playerColor = playersColor;
        selfEnemy.characterImage = characterImgs;
    },
    addPoints: function(point){
        ownTeamAddPointsHandler.call(selfEnemy, point);
    }
});