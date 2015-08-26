/* jshint newcap: false */

var cnvs = null;
var selfCanvas;
var clickCount = 0;

var mySocketId;

var players = [];
var arrPlayers = [];
var bushes = [];
var characterImages = [];
var bushImages = [];
var bushesPosition =[];
var playerOnCollision = false;

var playerPosition = [];
var flag = false;
var playerToMove;

var enemyEnd = [];

var newDrawFunction;
var createBushesFunction;

function playerCollisionHandler(){
    playerOnCollision = false;

    console.log("Collision");
    selfCanvas.bush = bush;

    //if(selfCanvas.bush == )
}

function getClickCoordinatesHandler(coordinates){
    flag = true;
    clickCount++;

    if(clickCount == 2){
        clickCount = 0;
    }else if(clickCount == 1){
        selfCanvas.newX = coordinates.x;
        selfCanvas.newY = coordinates.y;

        updateCoordinates(selfCanvas.socketId, selfCanvas.xPos, selfCanvas.yPos, selfCanvas.newX, selfCanvas.newY, selfCanvas.player);
    }
}

function updateCoordinates(id, prevx, prevy, newx, newy, player){
    flag = true;

    selfCanvas.fire("update_player", (id, prevx, prevy, newx, newy, player));
}

Polymer({

    cnvselement: "cnvselement",
    xPos: 0,
    yPos: 0,
    newX: 0,
    newY: 0,
    socketId: undefined,
    player: undefined,
    playerNumber: undefined,
    playerToMove: undefined,
    bush: undefined,
    randomPos: undefined,
    randomBushes: undefined,

    ready: function(){
        cnvs = this.shadowRoot.querySelector('#cnvs');
        selfCanvas = this;
    },
    onSetPlayer: function(data){
        mySocketId = data.id;
    },
    onPlayersReady: function(players){
        playerPosition = [];

        for(var p in players){
            playerPosition.push([players[p].xPos, players[p].yPos]);
            if(players[p].socketId == mySocketId){
                selfCanvas.socketId = players[p].socketId;
                selfCanvas.xPos = playerPosition[p][0];
                selfCanvas.yPos = playerPosition[p][1];
                selfCanvas.player = players[p].player;
            }
        }
    },
    onClient: function(client){
        playerPosition = [[0, 0], [0, 9], [9, 0], [9, 9]];
    },
    onMovePlayer: function(player){
        flag = true;
        newDrawFunction(player);
    },
    onBushesPos: function(data){
        console.log(data.randomBushes);

        selfCanvas.randomPos = data.randomPos[0];
        selfCanvas.randomBushes = data.randomBushes;

        createBushesFunction();
    }
});

requirejs.config({
    baseUrl: "/js/jsiso/",
    nodeRequire: require
});

requirejs([
    'jsiso/canvas/Control',
    'jsiso/canvas/Input',
    'jsiso/img/load',
    'jsiso/json/load',
    'jsiso/tile/Field',
    'jsiso/pathfind/pathfind',
    'requirejs/domReady!'
],
    function(CanvasControl, CanvasInput, imgLoader, jsonLoader, TileField, pathfind) {

        window.requestAnimFrame = (function() {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame  ||
                window.mozRequestAnimationFrame     ||
                window.oRequestAnimationFrame       ||
                window.msRequestAnimationFrame      ||
                function(callback, element) {
                    window.setTimeout(callback, 1000 / 30);
                };
        })();

        function launch() {
            jsonLoader(['js/jsiso/rgba-map.json']).then(function(jsonResponse) {
                var images = [{
                    graphics: [
                        "js/jsiso/img/game/ground/0-grass.png",
                        "js/jsiso/img/game/ground/1-path.png",
                        "js/jsiso/img/game/ground/blank-block.png"
                    ]
                },
                    {
                        graphics: [
                            "js/jsiso/img/players/player1.png",
                            "js/jsiso/img/players/player2.png",
                            "js/jsiso/img/players/player3.png",
                            "js/jsiso/img/players/player4.png"
                        ]
                    },
                    {
                        graphics: [
                            "js/jsiso/img/game/ground/bush_1.png",
                            "js/jsiso/img/game/ground/bush_2.png",
                            "js/jsiso/img/game/ground/bush_3.png",
                            "js/jsiso/img/game/ground/bush_4.png",
                            "js/jsiso/img/game/ground/bush_5.png"
                        ]
                    }
                ];
                imgLoader(images).then(function(imgResponse) {
                    var game = new main(0, 0, 10, 10, imgResponse[1], imgResponse[2]);  // X & Y drawing position, and tile span to draw
                    game.init([{
                        title: "Graphics",
                        layout: imgResponse[0].files["0-grass.png"],
                        graphics: imgResponse[0].files,
                        graphicsDictionary: imgResponse[0].dictionary,
                        heightMap: {
                            map: jsonResponse[0].ground_height,
                            offset: 0,
                            heightTile: imgResponse[0].files["blank-block.png"]
                        },
                        tileHeight: 50,
                        tileWidth: 100,
                        applyInteractions: true,
                        shadow: {
                            offset: 50, // Offset is the same height as the stack tile
                            verticalColor: '(0, 50, 0, 0.4)',
                            horizontalColor: '(20, 20, 50, 0.5)'
                        }
                    },
                        {
                            title: "AI",
                            layout: jsonResponse[0].object_map,
                            heightMap: {
                                map: jsonResponse[0].ground_height,
                                offset: 50, // Offset is the same height as the  graphics stack tile
                                heightMapOnTop: true
                            },
                            tileHeight: 50,
                            tileWidth: 100,
                            applyInteractions: true
                        }])
                });
            });
        }

        function main(x, y, xrange, yrange, playerImages, bushesImages) {
            characterImages = playerImages;
            bushImages = bushesImages;
            var mapLayers = [];
            var rangeX = xrange;
            var rangeY = yrange;
            var introRan = true;
            var zoomLevel = 0.1;
            var enemyStart = [[0, 0], [0, 9], [9, 0], [9, 9]]; // Starting location of AI
            var tile_coordinates = 0;
            var context = CanvasControl.create(1000, 600, {
                marginLeft: "auto",
                marginRight: "auto"
            }, cnvs, 0, "cnvselement");

            newDrawFunction = newDraw;

            var input = new CanvasInput(document, CanvasControl());
            input.mouse_action(function(coords) {
                mapLayers[0].setHeightmapTile(tile_coordinates.x, tile_coordinates.y, mapLayers[0].getHeightMapTile(tile_coordinates.x, tile_coordinates.y)); // Increase heightmap tile
                mapLayers.map(function(layer) {
                    tile_coordinates =  layer.applyMouseFocus(coords.x, coords.y); // Get the current mouse location from X & Y Coords
                    getClickCoordinatesHandler(tile_coordinates);
                });
            });
            input.mouse_move(function(coords) {
                mapLayers.map(function(layer) {
                    tile_coordinates = layer.applyMouseFocus(coords.x, coords.y); // Apply mouse rollover via mouse location X & Y
                });
            });

            function newDraw(player, calculatePaths){
                if(calculatePaths == undefined){
                    calculatePaths = 0;
                }
                var playerOnLocation = false;
                if(player == "undefined"){
                    console.log("Player to move is undefined");
                }else{
                    if(flag == false){
                        console.log("Drawing not allowed");
                    }else{
                        if(calculatePaths === 10) {
                            flag = true;
                            switch(player.player) {
                                case 1:
                                    console.log("Player 1 moving to ", player.newX, ", ", player.newY);
                                    playerOnLocation = drawPlayer(player);
                                    calculatePaths = 0;
                                    break;
                                case 2:
                                    console.log("Player 2 moving to ", player.newX, ", ", player.newY);
                                    playerOnLocation = drawPlayer(player);
                                    calculatePaths = 0;
                                    break;
                                case 3:
                                    console.log("Player 3 moving to ", player.newX, ", ", player.newY);
                                    playerOnLocation = drawPlayer(player);
                                    calculatePaths = 0;
                                    break;
                                case 4:
                                    console.log("Player 4 moving to ", player.newX, ", ", player.newY);
                                    playerOnLocation = drawPlayer(player);
                                    calculatePaths = 0;
                                    break;
                            }
                        }
                        calculatePaths += 1;
                        if(!playerOnLocation){
                            requestAnimFrame(function(){
                                newDraw(player, calculatePaths);
                            });
                        }
                    }
                }
            }

            function drawPlayer(player) {
                flag = true;
                players.map(function(e) {
                    // pathfind: id, start, end, map, diagonal, force
                    pathfind(players[player.player-1], [players[player.player-1].xPos, players[player.player-1].yPos], [player.newX, player.newY], mapLayers[0].getHeightLayout(), false, true).then(function (data) {
                        if (data.length > 0 && data[1] !== undefined) {
                            players[player.player-1].xPos = data[1].x;
                            players[player.player-1].yPos = data[1].y;
                        }
                    });
                });
                var playerPosNowX = players[player.player-1].xPos;
                var playerPosNowY = players[player.player-1].yPos;
                if(playerPosNowX == player.newX && playerPosNowY == player.newY){
                    for(var b in bushes){
                        if(bushes[b].xPos == playerPosNowX){
                            if(bushes[b].yPos == playerPosNowY){
                                console.log("Player on a bush");
                                playerOnCollision = true;
                                console.log(bushes[b].image.src);


                                var result = bushes[b].image.src.match(/<img src="([^"]+)">/);
                                console.log(result);
                            }
                        }
                    }
                    if(playerOnCollision == true){
                        playerCollisionHandler();
                    }
                    return true;
                }
                return false;
            }

            function createBushes(){
                for(var i = 0; i < selfCanvas.randomPos.length ; i++){
                    bushes.push({
                        image: bushImages.files[selfCanvas.randomBushes[i]],
                        xPos: selfCanvas.randomPos[i][0],
                        yPos: selfCanvas.randomPos[i][1]
                    });
                }
            }

            function firstDraw(){
                context.clearRect(0, 0, CanvasControl().width, CanvasControl().height);
                for (var i = 0; i < 0 + rangeY; i++) {
                    for (var j = 0; j < 0 + rangeX; j++) {
                        mapLayers.map(function(layer) {
                            if (layer.getTitle() === "Graphics") {
                                layer.draw(i,j); // Draw the graphics layer
                            }
                            else {
                                bushes.map(function(e) {
                                    if (i === e.xPos  && j === e.yPos) {
                                        layer.draw(i, j, e.image);
                                    }
                                });
                                players.map(function(e) {
                                    if (i === e.xPos  && j === e.yPos) {
                                        layer.draw(i, j, e.image);
                                    }
                                });
                            }
                        });
                    }
                }
                requestAnimFrame(firstDraw);
            }

            return {
                init: function(layers) {
                    for (var i = 0; i < 0 + layers.length; i++) {
                        mapLayers[i] = new TileField(context, CanvasControl().height, CanvasControl().width);
                        mapLayers[i].setup(layers[i]);
                        mapLayers[i].align("h-center", CanvasControl().width, xrange, 0);
                        mapLayers[i].align("v-center", CanvasControl().height, yrange, 0);
                    }
                    for(var i = 0; i < playerPosition.length ; i++){
                        players.push({
                            image: playerImages.files["player" + (i + 1)  + ".png"],
                            id: i + 1,
                            xPos: enemyStart[i][0],
                            yPos: enemyStart[i][1]
                        });
                    }
                    createBushesFunction = createBushes;

                    if(bushImages != null && bushImages != undefined && bushImages != ""){
                        selfCanvas.fire("bushes_get", bushImages);
                    }
                    firstDraw();
                }
            }
        }
        launch();
    }
);