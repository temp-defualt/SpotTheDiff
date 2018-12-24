//Setting click points
var images = [
  {
    file: "level1.jpg",
    bottom: "level1_bottom.jpg",
    positions: [
      {x: 120, y: 420},
      {x: 330, y: 362},
      {x: 340, y: 530},
      {x: 142, y: 572},
      {x: 58, y: 484}
    ],
    image: null
  },
  {
    file: "level2.jpg",
    bottom: "level2_bottom.jpg",
    positions: [
      {x: 224, y: 526},
      {x: 377, y: 436},
      {x: 160, y: 490},
      {x: 400, y: 523},
      {x: 420, y: 330}
    ],
    image: null
  },
  {
    file: "level3.jpg",
    bottom: "level3_bottom.jpg",
    positions: [
      {x: 163, y: 546},
      {x: 345, y: 495},
      {x: 145, y: 390},
      {x: 287, y: 403},
      {x: 220, y: 418}
    ],
    image: null
  }
];

//Setting where you can click from
var clickRadius = 25;

//Declaring canvas in JS
var canvas = document.getElementById("canvas_game");
//Declaring the context
var context = canvas.getContext("2d");

//Declaring the blur image
var blurred = document.getElementById("peanuts")

//Function pointer
var onClick;

//Function that puts image on canvas. Image used is one specified in array bracket
function draw(context, level, differences) {
    var image = images[level];
    if (image != null && image.image) {
        context.drawImage(image.image, 0, 0, 300, 400);
        blurred.src = "spot/" + images[level].bottom;
        if (differences != null) {
            for (var i = 0; i < image.positions.length; i++) {
                if (differences[i]) {
                    //Setting positions of highlight circle
                    drawCircle(context, image.positions[i].x, image.positions[i].y);
                    drawCircle(context, image.positions[i].x, image.positions[i].y - 200);
                }
            }
        }
    }
}

//Drawing of circle
function drawCircle(context, x, y) {
    context.beginPath();
    context.arc(x, y, clickRadius, 0, 2 * Math.PI);
    context.stroke();
}

//Function to load images into array
function load(context, id, callback) {
    var img = new Image();
    img.onload = function() {
        images[id].image = img;
        //Making sure images are loaded before continuing
        if (callback != null) {
            callback(context, img);
        }
    }
    img.src = "spot/" + images[id].file;
}

//Distance between two points
function getDistance(x1, y1, x2, y2) {
    var x = x1 - x2;
    var y = y1 - y2;
    return Math.sqrt(x * x + y * y);
}

//What to do when game is won
function victory() {
    //Draw text on click
    onClick = function(x, y) {
        drawTextAt(x, y);
    };

    //Draw text where mouse click
    function drawTextAt(x, y) {
        context.fillStyle = "rgb(255,255,0)";
        context.font = "25px sans-serif";
        context.fillText("You Won!", x, y);
        context.strokeText("You Won!", x, y);
    }

    function doSomething(evt) {
        var pos = getMouseXY(evt);
        drawTextAt(pos.x, pos.y);
    }
}

//Main content
//Befin game
function play() {
    var level = 0;
    var image;
    var found;

    function loadLevel(id) {
        level = id
        image = null;
        if (id > images.length - 1) { //final level
            victory();
        } else { //move on to next level
            found = new Array(images[level].positions.length);
            load(context, level, function(context, img) {
                image = images[level];
                draw(context, level);
            })
        }
    }

    //Seeing if click is in circle radius
    function click(x, y) {
        if (y < 200) {
            y += 200;
        }
        console.log("(" + (x/3)*2 + " , " + (((y-300)/3)*2)+200 + ")");
        if (image) {
            var shortestDistance = clickRadius;
            var index = null;
            for (var i = 0; i < image.positions.length; i++) {
                var position = image.positions[i];
                nx = (position.x/3)*2
                ny = (((position.y-300)/3)*2)+200
                var distance = getDistance(x, y, nx, ny);
                console.log(position);
                console.log(distance);
                if (distance <= shortestDistance) {
                    shortestDistance = distance;
                    position.x = nx;
                    position.y = ny;
                    index = i;
                }
            }
            if (index != null) {
                found[index] = true;
                draw(context, level, found);
            }
            var finished = true;
            for (var i = 0; i < image.positions.length; i++) {
                if (!found[i]) {
                    finished = false;
                    break
                }
            }
            if (finished) {
                loadLevel(level + 1);
            }
        }
    }
    onClick = click;
    loadLevel(level);
}

//Playing game!!!
play();

canvas.addEventListener("click", function(ev) {
    if (onClick) {
        var client = canvas.getBoundingClientRect();
        var actualWidth = client.width;
        var actualHeight = client.height;
        var width = canvas.width;
        var height = canvas.height;
        var ax = ev.clientX - client.left;
        var ay = ev.clientY - client.top;
        var x = width * ax / actualWidth;
        var y = height * ay / actualHeight;
        console.log("(" + x + " , " + y + ")");
        onClick(x, y)
    }
}, false);
