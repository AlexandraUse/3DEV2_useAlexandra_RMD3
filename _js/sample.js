console.log('Sample start');

requirejs.config({
    baseUrl: "/js/jsiso/",
	nodeRequire: require,
    paths: {
        jquery: 'http://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min'
    }
});
requirejs.onError = function (err) {
    console.log(err.requireType);
    if (err.requireType === 'timeout') {
        console.log('modules: ' + err.requireModules);
    }

    throw err;
};
console.log('start app.js');


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
	console.log('dom ready');
  // -- FPS --------------------------------
  window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame  ||
    window.mozRequestAnimationFrame     ||
    window.oRequestAnimationFrame       ||
    window.msRequestAnimationFrame      ||
    function(callback, element) {
      window.setTimeout(callback, 1000 / 60);
    };
  })();
  // ---------------------------------------
  function launch() {
  	console.log('launch triggered');
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
            "js/jsiso/img/players/main.png"
          ]
        }
      ];
      imgLoader(images).then(function(imgResponse) {
        var game = new main(0, 0, 10, 10, imgResponse[1]);  // X & Y drawing position, and tile span to draw
        game.init([{
          title: "Graphics",
          layout: jsonResponse[0].ground_map,
          graphics: imgResponse[0].files,
          graphicsDictionary: imgResponse[0].dictionary,
          heightMap: {
            map: jsonResponse[0].ground_height,
            offset: 0,
            heightTile: imgResponse[0].files["blank-block.png"],
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
  function main(x, y, xrange, yrange, playerImages) {
    var mapLayers = [];
    var rangeX = xrange;
    var rangeY = yrange;
    var calculatePaths = 0;
    var enemy = [];
    var introRan = false;
    var zoomLevel = 0.01;
    var enemyStart = [4, 0]; // Starting location of AI
    var enemyEnd = [4, 9]; // Ending location of AI
    var context = CanvasControl.create("cnvs", 920, 600, {
      background: "#000",
      display: "block",
      marginLeft: "auto",
      marginRight: "auto"
    });
    CanvasControl.fullScreen();

    var input = new CanvasInput(document, CanvasControl());
    input.mouse_action(function(coords) {
      mapLayers[0].setHeightmapTile(tile_coordinates.x, tile_coordinates.y, mapLayers[0].getHeightMapTile(tile_coordinates.x, tile_coordinates.y) + 1); // Increase heightmap tile
      mapLayers.map(function(layer) {
        tile_coordinates =  layer.applyMouseFocus(coords.x, coords.y); // Get the current mouse location from X & Y Coords
      });
    });
    input.mouse_move(function(coords) {
      mapLayers.map(function(layer) {
        tile_coordinates = layer.applyMouseFocus(coords.x, coords.y); // Apply mouse rollover via mouse location X & Y
      });
    });
    input.keyboard(function(key, pressed) {
      if (!pressed && introRan) {
        if (key === 81) {
          mapLayers.map(function(layer) {
            layer.rotate("left");
          });
          enemy.map(function(e) {
          });
        }
        if (key === 87) {
          mapLayers.map(function(layer) {
            layer.rotate("right");
          });
          enemy.map(function(e) {
          });
        }
        if (key === 65) {
          if (zoomLevel < 2) {
            zoomLevel += 0.1;
          }
        }
        if (key === 83) {
          if (zoomLevel > 0.2) {
            zoomLevel -= 0.1;
          }
        }
        mapLayers.map(function(layer) {
          layer.setZoom(zoomLevel);
          layer.align("h-center", CanvasControl().width, xrange, 0); // Center canvas drawing X
          layer.align("v-center", CanvasControl().height, yrange, 0); // Center canvas drawing Y
        });
      }
    });

    function draw() {
      context.clearRect(0, 0, CanvasControl().width, CanvasControl().height);
      if(calculatePaths === 100) { // Calculate AI paths every 100 ticks
        enemy.map(function(e) {
          pathfind(e.id, [e.xPos, e.yPos], [enemyEnd[0], enemyEnd[1]], mapLayers[0].getHeightLayout(), false, true).then(function (data) {
            if (data.length > 0 && data[1] !== undefined) {
              e.xPos = data[1].x;
              e.yPos = data[1].y;
            }
          });
        });
        calculatePaths = 0;
        enemy = enemy.filter(function(e) {
          if (e.xPos === Number(enemyEnd[0]) && e.yPos === Number(enemyEnd[1])) {
            return false;
          }
          else {
            return true
          }
        });
      }
      for (i = 0; i < 0 + rangeY; i++) {
        for (j = 0; j < 0 + rangeX; j++) {
          mapLayers.map(function(layer) {
            if (layer.getTitle() === "Graphics") {
              layer.draw(i,j); // Draw the graphics layer
            }
            else {
              enemy.map(function(e) {
                if (i === e.xPos  && j === e.yPos) {
                  layer.draw(i, j, e.image); // Only draw the enemy over writes of the AI layer
                }
              });
            }
          });
        }
        if (!introRan && zoomLevel <= 1) {
          zoomLevel += 0.001
          mapLayers.map(function(layer) {
            layer.setZoom(zoomLevel);
            layer.align("h-center", CanvasControl().width, xrange, 0); // Center canvas drawing X
            layer.align("v-center", CanvasControl().height, yrange, 0); // Center canvas drawing Y
          });
        }
        else {
          introRan = true;
        }
      }

      calculatePaths += 1;
      requestAnimFrame(draw);
    }
    return {
      init: function(layers) {
        for (var i = 0; i < 0 + layers.length; i++) {
          mapLayers[i] = new TileField(context, CanvasControl().height, CanvasControl().width);
          mapLayers[i].setup(layers[i]);
          mapLayers[i].align("h-center", CanvasControl().width, xrange, 0);
          mapLayers[i].align("v-center", CanvasControl().height, yrange, 0);
        };
        setInterval( function(){
          enemy.push({
            image: playerImages.files["main.png"],
            id: enemy.length,
            xPos: enemyStart[0],
            yPos: enemyStart[1]
          });
        }, 2500); // Create new enemy AI every 2.5 seconds
        draw();
      }
    }
  }
  launch();
}, function (err) {
        console.log('Error on loading modules');
});
