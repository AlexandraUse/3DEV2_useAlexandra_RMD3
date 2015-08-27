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
    }
});