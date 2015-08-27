/* jshint newcap: false */

function hideIntro(){
}

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
        console.log(document.querySelector('content'));
        console.log(document.querySelector('connectingscreen'));
        hideIntro();
    }
});