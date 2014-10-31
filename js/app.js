// SET OF CONSTANTS
var X_LEFT = 0,
    X_RIGHT = 909,
    Y_TOP = 0,
    Y_BOTTOM = 581,
    ROWS = 7,
    COLS = 9,
    CELL_HEIGHT = 83,
    CELL_WIDTH  = 101;

// MAP DEFINITION
var Map = function() {
  this.background;
  this.tiles = [];
  this.matrix = this.createMap();
}

Map.prototype.createMap = function() {
  var tile,
      row = [], 
      matrix = [];

  for (var i = 0; i < COLS; i++) {
    for (var j = 0; j < ROWS; j++) {
      tile = new Tile(i, j);
      this.tiles.push(tile);
      row.push({'x': i, 'y': j, 'status': 'empty'});
    }
    matrix.push(row);
    row = [];
  }

  return matrix;
}
Map.prototype.render = function()  {
  //ctx.drawImage(Resources.get(this.background), 0, 0);
  this.tiles.forEach(function(tile) {
    tile.render();
  });
}
var Tile = function(x, y) {
  this.x = x;
  this.y = y;
  this.sprite = 'images/stone-block.png';
}

Tile.prototype.render = function() {
  var x = this.x * CELL_WIDTH,
      y = this.y * CELL_HEIGHT + 20;
  ctx.drawImage(Resources.get(this.sprite), x, y);
}
var map = new Map();

// CREATING STATIC MAP ITEMS
var Item = function() {
  this.x = this.setX();
  this.y = this.setY();
  this.checkPosition();
  this.sprite = 'images/Star.png';
  this.destroyed = false;
  this.setTileStatus('taken');
}

Item.prototype.setX = function() {
  var i = Math.floor(Math.random() * COLS);
  return map.matrix[i][0].x;
}
Item.prototype.setY = function() {
  var j = Math.floor(Math.random() * ROWS);
  return map.matrix[0][j].y;
}
Item.prototype.setTileStatus = function(status) {
  var i = this.x,
      j = this.y;
  map.matrix[i][j].status = status;
  return status;
}
Item.prototype.checkPosition = function(){
  var i = this.x,
      j = this.y;
  if (map.matrix[this.x][this.y].status != 'empty') {
    this.x = this.setX();
    this.y = this.setY();
    this.checkPosition();
  }

  return true;
}
Item.prototype.dissapear = function() {
  var item = this,
  destroyTimeout = item.timeToLive * 1000,
  fadingTimeout = destroyTimeout - 3000;
  setTimeout(function() {
    item.fading = true;
  }, fadingTimeout);
  setTimeout(function() {
    item.destroyed = true;
    map.matrix[item.x][item.y].status = 'empty';
  }, destroyTimeout);
}
Item.prototype.render = function() {
  var x = this.x * CELL_WIDTH,
      y = this.y * CELL_HEIGHT; 
  if (this.fading) {
    ctx.globalAlpha = 0.5;
  }
  ctx.drawImage(Resources.get(this.sprite), x, y);
  ctx.globalAlpha = 1;
}

var MedKit = function() {
  Item.call(this);
  this.sprite = 'images/Heart.png';
  this.timeToLive = 15;
  this.setTileStatus('collectable');
  //this.dissapear();
}

MedKit.prototype = Object.create(Item.prototype);
MedKit.prototype.constructor = MedKit;

var Grave = function() {
  Item.call(this);
  this.sprite = 'images/Rock.png';
  this.timeToLive = 15;
  this.setTileStatus('obstacle');
  //this.dissapear();
}

Grave.prototype = Object.create(Item.prototype);
Grave.prototype.constructor = Grave;

var Key = function() {
  Item.call(this);
  this.sprite = 'images/Key.png';
  this.setTileStatus('collectable');
}

Key.prototype = Object.create(Item.prototype);
Key.prototype.constructor = Key;

var medkit = new MedKit();
var key = new Key();
var grave = new Grave();

// CREATING PLAYER
var Player = function() {
  this.x = this.setPlayerX();
  this.y = this.setPlayerY();
  this.sprite = 'images/char-boy.png';
  //this.hp = new HealthPoints();
  this.setTileStatus('player');
}

Player.prototype.setPlayerX = function() {
  var x = Math.floor(Math.random() * 5) + 2;
  return x;
}
Player.prototype.setPlayerY = function() {
  var y = Math.floor(Math.random() * 2) + 5;
  return y;
}
Player.prototype.setTileStatus = function(status) {
  var i = this.x,
      j = this.y;
  map.matrix[i][j].status = status;
  return status;
}
Player.prototype.update = function(dt) {
  //this.hp.update(dt);
}
Player.prototype.resetPosition = function() {
  this.x = this.setPlayerX();
  this.y = this.setPlayerY();  
}
Player.prototype.render = function() {
  var x = this.x * CELL_WIDTH,
      y = this.y * CELL_HEIGHT;
  ctx.drawImage(Resources.get(this.sprite), x, y);
}
Player.prototype.moveOptions = function() {
  var moveOptions = [true, true, true, true],
      items = level.items;
  if (this.y <= 0) {
    moveOptions[0] = false;
  }
  if (this.x <= 0) {
    moveOptions[1] = false;
  }
  if (this.y >= ROWS - 1) {
    moveOptions[2] = false;
  }
  if (this.x >= COLS - 1) {
    moveOptions[3] = false;
  }

  for (var item, i = 0; i < items.length; i++) {
    item = items[i];
    if (item instanceof Grave) {
      if (this.y == item.y + 1 && this.x == item.x) {
        moveOptions[0] = false;
      }
      if (this.x == item.x + 1 && this.y == item.y) {
        moveOptions[1] = false;
      }
      if (this.y == item.y - 1 && this.x == item.x) {
        moveOptions[2] = false;
      }
      if (this.x == item.x - 1 && this.y == item.y) {
        moveOptions[3] = false;
      }
    }
  }

  return moveOptions;
}
Player.prototype.handleInput = function(move) {
  var moveOptions = this.moveOptions();
  this.setTileStatus('empty');
  switch(move) {
    case 'up':
      this.y = moveOptions[0] ? this.y - 1 : this.y;
      break;
    case 'left':
      this.x = moveOptions[1] ? this.x - 1 : this.x;
      break;
    case 'down':
      this.y = moveOptions[2] ? this.y + 1 : this.y;
      break;
    case 'right':
      this.x = moveOptions[3] ? this.x + 1 : this.x;
      break;   
  }
  this.setTileStatus('player');
}
Player.prototype.die = function() {
  this.hp.loose(1);
  this.resetPosition();  
}

var HealthPoints = function() {
  this.value = 5;
  this.sprite = 'images/small-heart.png';
  this.damageOverTime = 1;
  this.timeToTick = 10;
  this.afterLastTick = 0;
}
HealthPoints.prototype.loose = function(num) {
  this.value -= num;
}
HealthPoints.prototype.gain = function(num) {
  this.value += num;
}
HealthPoints.prototype.mesureBar = function() {
  var l = Math.round(190 * this.value / 5.0);
  return l;
}
HealthPoints.prototype.render = function() {
  ctx.fillStyle = '#2f6bf8';
  ctx.fillRect(5, 5, 200, 40);
  ctx.fillStyle = '#132d65';
  ctx.fillRect(10, 10, this.mesureBar(), 30);
}
HealthPoints.prototype.update = function(dt) {
  this.afterLastTick += dt;
  if (this.afterLastTick >= this.timeToTick) {
    this.value -= this.damageOverTime;
    this.afterLastTick = 0;
  }
}

// ENEMY
var Enemy = function() {
  this.direction = this.setDirection();
  this.speed = this.setSpeed();
  this.sprite = this.setSprite(this.direction, this.speed);
  this.x = this.setEnemyX(this.direction);
  this.y = this.setEnemyY(this.direction);
}

Enemy.prototype.speedValues = [20, 40, 80, 160, 320];
Enemy.prototype.ordinateValues = [60, 143, 227, 310];
Enemy.prototype.spriteValues = [['images/char-boy.png', 'images/char-cat-girl.png'], ['images/char-horn-girl.png', 'images/char-pink-girl.png']];

Enemy.prototype.setDirection = function() {
  var direction = Math.floor(Math.random() * 2);
  return direction === 0 ? 1 : -1;
}
Enemy.prototype.setSpeed = function() {
  var speed = this.speedValues[Math.floor(Math.random() * 5)];
  return speed;
}
Enemy.prototype.setSprite = function(direction, speed) {
  var sprite = direction === 1 ? this.spriteValues[0] : this.spriteValues[1];
  sprite = speed > 80 ? sprite[0] : sprite[1];
  return sprite;
}
Enemy.prototype.setEnemyX = function(direction) {
  var x = direction === 1 ? -(Math.floor(Math.random() * 200)) : (Math.floor(Math.random() * 200)) + 909;
  return x;
}
Enemy.prototype.setEnemyY = function() {
  var y = this.ordinateValues[Math.floor(Math.random() * 4)];
  return y;
}
Enemy.prototype.update = function(dt) {
  this.x += this.direction * this.speed * dt;
}
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

var Obstacle = function() {
  this.x = this.setObstacleX();
  this.y = this.setObstacleY();
  this.timeToLive = 30;
  this.sprite = 'images/Rock.png';
}

Obstacle.prototype.ordinateValues = [60, 143, 227, 310];
Obstacle.prototype.setObstacleX = function() {
  var x = (Math.floor(Math.random() * 7) + 1) * 101;
  return x;
}
Obstacle.prototype.setObstacleY = function() {
  var y = this.ordinateValues[Math.floor(Math.random() * 4)];
  return y;
}
Obstacle.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}
Obstacle.prototype.update = function(dt) {
  this.timeToLive -= dt;
}

var Level = function() {
  this.duration = 10;
  this.difficulty = 1;
  this.enemyNumber = 8;
  this.items = [];
  this.enemies = [];
  this.obstacleNumber = 0;
  this.obstacles = [];
  this.timePlayed = 0;
}

Level.prototype.checkDuration = function(dt) {
  if ((this.timePlayed >= this.duration) && (this.difficulty < 3)) {
    this.increaseDifficulty();  
  } else {
    this.timePlayed += dt;
  }
}
Level.prototype.increaseDifficulty = function() {
  this.timePlayed = 0;
  this.duration += 5;
  this.difficulty += 1;
  this.enemyNumber += 3;
  this.obstacleNumber += 1;  
}
Level.prototype.generateEnemies = function(num) {
  num = num || this.enemyNumber; 
  for (var enemy, i = 0; i < num; i++) {
    enemy = new Enemy();
    this.enemies.push(enemy);
  }

  return this.enemies;   
}
Level.prototype.checkEnemies = function() {
  var activeEnemies = [];
  for (var enemy, i = 0; i < this.enemies.length; i++) {
    enemy = this.enemies[i];
    if (enemy.x >= -200 && enemy.x <= 1109) {
      activeEnemies.push(enemy);
    }
  }

  this.enemies = activeEnemies;
  return this.enemies;
}
Level.prototype.addMissingEnemies = function() {
  var numberMissing = this.enemyNumber - this.enemies.length;
  if (numberMissing > 0) {
    this.generateEnemies(numberMissing);
  }

  return this.enemies;
}
Level.prototype.allowedObstacle = function() {
  obstacle = new Obstacle();
  if (Math.abs(player.x - obstacle.x) <= 2 && Math.abs(player.y - obstacle.y) <= 2) {
    this.allowedObstacle();
  } else {
    return obstacle;
  }
}
Level.prototype.generateObstacles = function(num) {
  num = num || this.obstacleNumber;
  for (var obstacle, i = 0; i < num; i++) {
    obstacle = this.allowedObstacle();
    this.obstacles.push(obstacle);
  }

  return this.obstacles;
}
Level.prototype.checkObstacles = function() {
  var activeObstacles = [];
  for (var obstacle, i = 0; i < this.obstacles.length; i++) {
    obstacle = this.obstacles[i];
    if (obstacle.timeToLive > 0) {
      activeObstacles.push(obstacle);
    }
  }

  this.obstacles = activeObstacles;
  return this.obstacles;
}
Level.prototype.addMissingObstacles = function() {
  var numberMissing = this.obstacleNumber - this.obstacles.length;
  if (numberMissing > 0) {
    this.generateObstacles(numberMissing);
  }

  return this.obstacles;
}
Level.prototype.update = function(dt) {
  level.checkDuration(dt);
  level.checkEnemies();
  level.addMissingEnemies();
  level.checkObstacles();
  level.addMissingObstacles();
} 

var level = new Level();
level.generateEnemies();
level.generateObstacles();
level.items.push(key);
level.items.push(medkit);
level.items.push(grave);

var player = new Player();
//var obstacle = new Obstacle();
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
window.addEventListener('keydown', function(e) {
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
