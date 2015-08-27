/* jshint newcap: false */

var selfConnecting;
Polymer({

    bush: undefined,

    ready: function(){
        selfConnecting = this;
    },
    onPlayersReady: function(){
        document.querySelector('.start').addEventListener('click', function(e) {
            console.log('Start button');
        });
    }
});