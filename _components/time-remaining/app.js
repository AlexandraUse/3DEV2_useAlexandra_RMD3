/* jshint newcap: false */

var sec = 0;
var selfTimer;
function getTimersHandler(time){
    sec = time;
    var id = window.setInterval(function() {
        sec--;
        selfTimer.seconds = sec;
        if (sec < 1) {
            clearInterval(id);
            console.log("Timer complete");
            return;
        }
        selfTimer.fire("set_timer");
    }, 1000);
    //return self.seconds;
}

Polymer({

    timer: undefined,
    seconds: undefined,

    ready: function(){
        selfTimer = this;
    },
    onPlayersReady: function(){
        getTimersHandler.call(this, 60);
    },
    timerSet: function(time){
        selfTimer.seconds = time;
    }
});