/* jshint newcap: false */

function hideIntro(){
    selfConnecting
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
        selfConnecting.$.connectingscreen.hide();
        console.log(document.querySelector('content'));
        hideIntro();
    }
});