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
var Player = function() {
  this.x = this.setPlayerX();
  this.y = this.setPlayerY();
  this.sprite = 'images/char-boy.png';
  this.hp = new HealthPoints();
}

Player.prototype.setPlayerX = function() {
  var x = 404;
  return x;
}
Player.prototype.setPlayerY = function() {
  var y = 393;
  return y;
}
Player.prototype.update = function(dt) {
  this.hp.update(dt);
}
Player.prototype.resetPosition = function() {
  this.x = this.setPlayerX();
  this.y = this.setPlayerY();  
}
Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}
Player.prototype.handleInput = function(move) {
  switch(move) {
    case 'left':
      this.x = this.x <= 0 ? this.x : this.x - 101;
      break;
    case 'right':
      this.x = this.x >= 808 ? this.x : this.x + 101;
      break;
    case 'up':
      this.y = this.y <= 61 ? this.y : Math.round(this.y - 83.3);
      break;
    case 'down':
      this.y = this.y >= 476 ? this.y : Math.round(this.y + 83.3);
      break;
  }
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
HealthPoints.prototype.render = function() {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 200, 40);
  for (var x = 0, i = 0; i < this.value; i++)
  {
    ctx.drawImage(Resources.get(this.sprite), x, 0);
    x += 30;
  }
}
HealthPoints.prototype.update = function(dt) {
  this.afterLastTick += dt;
  if (this.afterLastTick >= this.timeToTick) {
    this.value -= this.damageOverTime;
    this.afterLastTick = 0;
  }
}

var Obstacle = function() {
  this.x = this.setObstacleX();
  this.y = this.setObstacleY();
  this.timeToLive = 5;
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
  this.enemyNumber = 10;
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
  this.enemyNumber += 5;
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
Level.prototype.generateObstacles = function(num) {
  num = num || this.obstacleNumber;
  for (var obstacle, i = 0; i < num; i++) {
    obstacle = new Obstacle();
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
