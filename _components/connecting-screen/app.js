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
    onBroadcastClient: function(data){
        for(var p in data){
            selfConnecting.player = p + 1;
        }
    },
    onDisconnectedClient: function(data){
        for(var p in data[0]){
            selfConnecting.player = p + 1;
        }
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