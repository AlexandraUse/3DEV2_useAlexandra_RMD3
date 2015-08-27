/* jshint newcap: false */

var selfConnecting;
Polymer({

    bush: undefined,

    ready: function(){
        selfConnecting = this;
    },
    onPlayersReady: function(){
        console.log(selfConnecting.$.start);
        console.log(selfConnecting.shadowRoot.querySelector('start'));
        console.log(document.querySelector('start'));
        console.log($('.start'));
        $('.start').addEventListener('click', function(e) {
            console.log('Start button');
           
        });

        /*selfConnecting.$.start.addEventListener('click', function(e) {
            console.log('Start button');
        });*/
    }
});