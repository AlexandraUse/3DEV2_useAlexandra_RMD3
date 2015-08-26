/* jshint newcap: false */

var bush;

var selfCollector;
Polymer({

    bush: undefined,

    ready: function(){
        selfCollector = this;
    },
    onBushesSet: function(data){
        console.log("Bush to collect: ", data);

        bush = data;
        selfCollector.bush = bush;
    }
});