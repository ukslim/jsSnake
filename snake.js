


var Key = {
		LEFT: 37,
		UP: 38,
		RIGHT: 39,
		DOWN: 40,
		ENTER: 13
};

var Opposite = {
		37: 39,
		39: 37,
		38: 40,
		40: 38
}

var GameState = {
	STOPPED: 0,
	RUNNING: 1
}

var State = {
		grid: [],
		headX: 15,
		headY: 15,
		gameState: "STOPPED",
		direction: Key.UP,
		snakeLen:10
}

var cellState = {
		EMPTY: 1024,
		APPLE: 1023
		// lower numbers represent the age of the snake element
}

function snake(width, height) {
	make_grid(width,height);
	setupEventListener();
	startGame();
}

function startGame(){
	snakeLen = 10;
	updateScore();
	State.headX = 15;
	State.headY = 15;
	State.direction = Key.UP;
	eachCell(function(cell) {
		cell.snakeVal = cellState.EMPTY;
	});
	document.getElementById('playarea').className = "playarea";
	makeAnApple();
	State.gameState = GameState.RUNNING;
	intervalId = window.setInterval(gameTick, 120);
}

function setupEventListener(){
	window.addEventListener('keydown', function(event) { 
		if(Opposite[event.keyCode] != State.direction) {
			State.direction = event.keyCode;
		}

		if(event.keyCode == Key.ENTER && State.gameState == GameState.STOPPED) { 
			startGame();
		}

	}, false);
	}

gameTick = function() {
	handleInput();
	draw();
}
function draw(){
	eachCell(function(cell){
		if(cell.snakeVal <= snakeLen) {
			cell.snakeVal++;
		}
		if(cell.snakeVal > snakeLen && cell.snakeVal < cellState.APPLE) {
			cell.snakeVal=cellState.EMPTY; 
		}
		if(cell.snakeVal < snakeLen || cell.snakeVal == cellState.APPLE) {
			cell.className = 'filled';
		} else {
			cell.className = 'empty';
		}
	});
}

function handleInput() {

	switch(State.direction) {
	case Key.UP:
		State.headX--;
		break;
	case Key.DOWN:
		State.headX++;
		break;
	case Key.LEFT:
		State.headY--;
		break;
	case Key.RIGHT:
		State.headY++;
		break;
	default:
	}

	if(State.headX <0 || 
	   State.headX >= State.grid.length || 
	   State.headY<0 || 
	   State.headY >= State.grid[0].length || // collided with wall
	   State.grid[State.headX][State.headY].snakeVal < snakeLen // collided with self
	) {
		gameEnd();
		return
	}

	var cell = State.grid[State.headX][State.headY];
	if(cell.snakeVal == cellState.APPLE) { // apple
		State.snakeLen++;
		updateScore();
		makeAnApple();
	}
	cell.snakeVal = 0;

}

function updateScore(){
	document.getElementById("score").innerHTML = State.snakeLen - 10;
}

// Find an empty cell and put an apple in it
function makeAnApple() {
	var grid = State.grid;
	var cell;
	do {
		var x = Math.floor(Math.random() * grid.length);
		var y = Math.floor(Math.random() * grid[0].length);
		cell = grid[x][y];
	} while (cell.snakeVal != cellState.EMPTY);
	cell.snakeVal = cellState.APPLE;
}

function gameEnd() {
	window.clearInterval(intervalId);
	document.getElementById('playarea').className = "playarea dead";
	State.gameState = GameState.STOPPED;
}

function make_grid(width,height) {
	var table = document.getElementById('playarea');
	for(var i=0; i<height; i++) {
		State.grid[i] = [];
		var row = table.insertRow();
		for(var j=0; j<width; j++) {
			var cell = row.insertCell(-1);
			State.grid[i][j] = cell;
			cell.innerHTML = "&nbsp;"
		}
	}
}

function eachCell(func) {
	var grid = State.grid;
	for(var i=0; i<grid.length; i++) {
		for(var j=0; j<grid[0].length; j++) {
			var cell = grid[i][j];
			func(cell);
		}
	}
}

