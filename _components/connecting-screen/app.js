/* jshint newcap: false */

var selfConnecting;
Polymer({

    bush: undefined,

    ready: function(){
        selfConnecting = this;
    },
    onPlayersReady: function(){
        selfConnecting.shadowRoot.querySelector('start').addEventListener('click', function(e) {
            console.log('Start button');
        });
    }
});