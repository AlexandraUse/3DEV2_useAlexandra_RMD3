/* jshint newcap: false */

var mySocketData;
var selfConnecting;
Polymer({

    bush: undefined,
    playersOnReady: false,
    player: 0,

    ready: function(){
        selfConnecting = this;
    },
    onClient: function(data){
        mySocketData = data;
        selfConnecting.player = data.player;
    },
    onDisconnectedClient: function(data){
        selfConnecting.player = data.player;
    },
    onPlayersReady: function(){
        selfConnecting.playersOnReady = true;
    },
    clickStart: function(e){
        if(selfConnecting.playersOnReady == true){
            console.log('Start button');
            document.querySelector('.connectingscreen').style.display = 'none';
            document.querySelector('.content').style.display = 'inline';
            selfConnecting.playersOnReady = false;
        }
    }
});