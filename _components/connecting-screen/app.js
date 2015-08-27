/* jshint newcap: false */

var selfConnecting;
Polymer({

    bush: undefined,

    ready: function(){
        selfConnecting = this;
    },
    onPlayersReady: function(){
    },
    clickStart: function(e){
        console.log('Start button');
        document.querySelector('.connectingscreen').style.display = 'none';
        document.querySelector('.content').style.display = 'inline';
    }
});