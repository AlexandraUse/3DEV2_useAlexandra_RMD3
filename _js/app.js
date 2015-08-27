var own_team_info = document.getElementsByTagName("own-team-info")[0];
var enemy_team_info = document.getElementsByTagName("enemy-team-info")[0];
var time_remaining = document.getElementsByTagName("time-remaining")[0];
var canvas_body = document.getElementsByTagName("canvas-body")[0];
var collector_item = document.getElementsByTagName("collector-item")[0];
var connecting_screen = document.getElementsByTagName("connecting-screen")[0];

requirejs([
    '/socket.io/socket.io.js'
],function(io){
    this.socket = io(window.location.hostname);

    var self = this;
    var socket = this.socket;
    this.socket.on("new_player", (function(data){
        console.log("Connecting myself: ", data);
        socket.emit("new player", data);
    }));
    this.socket.on("new_player", canvas_body.onSetPlayer.bind(this));
    this.socket.on("player_disconnected", (function(data){
        console.log("Disconnecting: ", data);
    }));
    this.socket.on("player_connected", canvas_body.onClient.bind(this));
    this.socket.on("player_connected", own_team_info.onClient.bind(this));
    this.socket.on("remove_player", (function(data){
        socket.emit("remove player", data);
    }));
    this.socket.on("players_ready", own_team_info.onPlayersReady.bind(this));
    this.socket.on("players_ready", enemy_team_info.onPlayersReady.bind(this));
    this.socket.on("players_ready", canvas_body.onPlayersReady.bind(this));
    this.socket.on("players_ready", time_remaining.onPlayersReady.bind(this));
    this.socket.on("players_ready", connecting_screen.onPlayersReady.bind(this));
    this.socket.on("move_player", canvas_body.onMovePlayer.bind(this));
    this.socket.on("bushes_set", collector_item.onBushesSet.bind(this));
    this.socket.on("bushes_set", canvas_body.onBushesSet.bind(this));
    this.socket.on("bushes_pos_set", canvas_body.onBushesPos.bind(this));
    this.socket.on("timer_set", time_remaining.timerSet.bind(this));
    this.socket.on("points_set", own_team_info.pointsSet.bind(this));

    canvas_body.addEventListener("update_player", (function(e){
        socket.emit("update player", {id: e.currentTarget.socketId, prevX: e.currentTarget.xPos, prevY: e.currentTarget.yPos, newX: e.currentTarget.newX, newY: e.currentTarget.newY, player: e.currentTarget.player, team: e.currentTarget.team});
    }).bind(this));

    canvas_body.addEventListener("bushes_images", (function(e){
        socket.emit('bushes get', e.detail.dictionary);
    }).bind(this));

    canvas_body.addEventListener("bushes_pos", (function(e){
        socket.emit('bushes pos', e.detail.dictionary);
    }).bind(this));

    canvas_body.addEventListener("update_points", (function(e){
        socket.emit('update points', e.detail.team);
    }).bind(this));

    time_remaining.addEventListener("set_timer", (function(e){
        socket.emit('set timer', e.currentTarget.seconds);
    }).bind(this));
});