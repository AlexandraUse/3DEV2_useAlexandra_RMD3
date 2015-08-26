/* jshint newcap: false */

var sec = 0;
var selfTimer;
function getTimersHandler(time){
    //console.log("Get timers: " + time);
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
    return self.seconds;
}

Polymer({

    timer: undefined,
    seconds: 60,

    ready: function(){
        this.fire("getTimer");
        selfTimer = this;
    },
    getTimer: function(time){
        getTimersHandler.call(this, time);
    },
    timerSet: function(time){
        selfTimer.seconds = time;
    }
});