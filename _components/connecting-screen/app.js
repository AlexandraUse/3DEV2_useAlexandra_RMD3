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
        document.querySelector('.connectingscreen').hide();
        document.querySelector('.content').show();
        hideIntro();
    }
});