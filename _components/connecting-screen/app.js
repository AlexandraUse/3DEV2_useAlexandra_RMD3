/* jshint newcap: false */

var selfConnecting;
Polymer({

    bush: undefined,

    ready: function(){
        selfConnecting = this;
    },
    onPlayersReady: function(){
        this.shadowRoot.querySelector('start').addEventListener('click', function(e) {
            console.log('Start button');
        });
    }
});