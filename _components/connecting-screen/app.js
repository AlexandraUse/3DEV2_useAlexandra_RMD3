/* jshint newcap: false */

var selfConnecting;
Polymer({

    bush: undefined,
    playersOnReady: false,

    ready: function(){
        selfConnecting = this;
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