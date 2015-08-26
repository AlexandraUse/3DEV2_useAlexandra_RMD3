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
    }
});