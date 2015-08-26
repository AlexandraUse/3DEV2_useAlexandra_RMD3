module.exports = function(server){

    var io = require('socket.io')(server);
	var _ = require("lodash");

	var Character = require('../classes/Character.json');
    var Status = require('../classes/Status.json');
    var Player = require('../classes/Player.js');
    var Keys = require('../classes/Keys.js');

	var clients = [];
    var team;
    var characters = [];
    var randomCharacters = [];
    var remotePlayers = [];
    var localPlayer;
    var idExists;
    var existingPlayers = [];
    var existingClients = [];
    var positions = [[0, 0], [0, 9], [9, 0], [9, 9]];
    var player;
    var bushes = [];
    var bushesPos = [];
    var selectedBush;
    var pointsTeam1 = 0;
    var pointsTeam2 = 0;

    function playerById(id) {
        var i;
        for (i = 0; i < remotePlayers.length; i++) {
            if (remotePlayers[i].id == id)
                return remotePlayers[i];
        }
        return false;
    }

    function existsInArray(elem, array){
        if ( array.indexOf ) {
            return array.indexOf( elem );
        }
        for ( var i = 0, length = array.length; i < length; i++ ) {
            if ( array[ i ] === elem ) {
                return i;
            }
        }
        return -1;
    }

	io.sockets.on('connection', function(socket) {
        console.log("Player connecting " + socket.id);

        characters = Character.characters;

        var client = {
            socketId: socket.id,
            team: team,
            player: player,
            xPos: 0,
            yPos: 0,
            kleurPlayer: randomCharacters[0]
        };

		clients.push(client);

        socket.emit("new_player", {id: client.socketId, team: client.team, player: client.player, x: client.xPos, y: client.yPos, kleur: client.kleurPlayer});

        socket.on('disconnect', function() {
            console.log("Player disconnecting, removing player " + client.socketId);

            var removePlayer = playerById(client.socketId);

            if (!removePlayer) {
                console.log("Player not found: "+ client.socketId);
                return;
            }


            idExists = existsInArray(removePlayer.id, existingPlayers);
            if (idExists >= 0) {
                existingPlayers.splice(idExists, 1);
                existingClients.splice(idExists, 1);
                remotePlayers.splice(idExists, 1);
            }
            console.log("Player removed, existing players: ", existingClients);
            console.log("Player removed, remote players: ", remotePlayers);

            socket.leave(socket.room);
            socket.broadcast.emit("player_disconnected", client.socketId);
        });

        socket.on('new player', function(data) {
            console.log("New player connected " + data.id );
            var newPlayer = new Player(data.x, data.y);
            newPlayer.id = data.id;

            remotePlayers.push(newPlayer);

            var i, existingPlayer, startX = 0, startY = 0;
            for (i = 0; i < remotePlayers.length; i++) {
                existingPlayer = remotePlayers[i].id;
                client.player = i + 1;
                client.kleurPlayer = characters[i];

                if(client.player == 1 || client.player == 2){
                    client.team = 1;
                }else{
                    client.team = 2;
                }
                startX = positions[i][0];
                startY = positions[i][1];
                localPlayer = new Player(startX, startY);
                client.xPos = localPlayer.getX();
                client.yPos = localPlayer.getY();

                client.socketId = existingPlayer;
            }

            idExists = existsInArray(existingPlayer, existingPlayers);
            if (idExists >= 0) {
                existingPlayers.splice(idExists, 1);
                existingClients.splice(idExists, 1);
            } else {
                existingPlayers.push(existingPlayer);
                existingClients.push(client);
            }

            console.log("New player connected, existing players: " + existingPlayers);

            socket.room = 'room1';
            socket.join('room1');
            socket.emit("player_connected", client);

            if(existingPlayers.length == 4){
                console.log("All players ready", existingClients);

                io.sockets.emit("players_ready", existingClients);
            }
        });

        socket.on('update player', function(data) {
            console.log("Update player " + data.id + " from " + data.prevX + ", " + data.prevY + " to " + data.newX + ", " + data.newY + " Player " + data.player);

            if(localPlayer.update(data.newX, data.newY)){
                console.log("localPlayer x and y changed");

                if(existingPlayers.length == 4){

                    var movePlayer = playerById(data.id);

                    if (!movePlayer) {
                        console.log("Player not found: "+ data.id);
                        return;
                    }
                    movePlayer.setX(data.newX);
                    movePlayer.setY(data.newY);

                    io.sockets.emit("move_player", {id: data.id, prevX: data.prevX, prevY: data.prevY, newX: movePlayer.getX(), newY: movePlayer.getY(), player: data.player, team: data.team});
                }
            }
        });

        socket.on("bushes get", function(data){

            bushes = data;
            var bush = bushes[Math.floor(Math.random()*bushes.length)];
            io.sockets.emit("bushes_set", bush);
        });

        socket.on("bushes pos", function(data){

            var bushesPos1 = [[4, 4], [7, 7], [7, 8], [5, 4], [4, 5], [8, 4], [7, 4], [7, 3], [4, 5], [4, 1], [4, 2],
                [3, 1], [3, 0], [2, 1], [2, 9], [3, 9], [4, 9], [3, 8], [8, 7], [0, 4], [0, 5]];
            var bushesPos2 = [[4, 4], [5, 4], [4, 5], [4, 6], [8, 4], [7, 4], [7, 3], [4, 5], [4, 1], [4, 2],
                [3, 1], [3, 0], [3, 5], [3, 4], [2, 1], [2, 9], [3, 9], [4, 9], [3, 8], [8, 7], [0, 4], [0, 5]];
            var bushesPosition = [];

            bushesPosition.push([bushesPos1], [bushesPos2]);
            var randomBushesPosition = bushesPosition[Math.floor(Math.random()*bushesPosition.length)];

            var randomBushes = [];
            for(var i = 0; i < randomBushesPosition[0].length ; i++){
                var randomBush = bushes[Math.floor(Math.random()*bushes.length)];
                randomBushes.push(randomBush);
            }
            io.sockets.emit("bushes_pos_set", {randomPos: randomBushesPosition, randomBushes: randomBushes});
        });

        socket.on("set timer", function(data){
            io.sockets.emit("timer_set", data);
        });

        socket.on("update points", function(data){
            console.log(data);

            if(data == 1){
                pointsTeam1 += 100;
            }else if(data == 2){
                pointsTeam2 += 100;
            }

            io.sockets.emit("points_set", {team1: pointsTeam1, team2: pointsTeam2});
        });
	});
};
