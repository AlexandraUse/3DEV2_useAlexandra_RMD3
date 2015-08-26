/* jshint newcap: false */

var conn;
var arrPlayers = [];
var playersColor = [];
var characterImgs = [];

var selfOwn;
Polymer({

    points: 0,
    socketId: undefined,
    peer: undefined,
    peerId: undefined,
    characterown: undefined,
    peerapikey: undefined,
    stream: undefined,
    player1: undefined,
    player2: undefined,

    team1: 0,
    team2: 0,

    player: undefined,
    playerColor: undefined,
    characterImage: undefined,
    xPos: 0,
    yPos: 0,

    ready: function(){
        selfOwn = this;
    },
    onPlayersReady: function(players){
        for(var p in players){
            playersColor.push(players[p].kleurPlayer);
            characterImgs.push(players[p].player);
        }
        selfOwn.playerColor = playersColor;
        selfOwn.characterImage = characterImgs;
    },
    onClient: function(client){
        selfOwn.socketId = client.socketId;
        selfOwn.player = client.player;
        selfOwn.playerColor = client.kleurPlayer;
        selfOwn.xPos = client.xPos;
        selfOwn.yPos = client.yPos;
    },
    pointsSet: function(data){
        console.log("Update points teams, team 1: ", data.team1, " team 2: ", data.team2);

        selfOwn.team1 = data.team1;
        selfEnemy.team2 = data.team2;
    }
});