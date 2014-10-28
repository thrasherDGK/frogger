// Enemies our player must avoid
var Enemy = function() {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started
  this.direction = this.setDirection();
  this.speed = this.setSpeed();
  this.sprite = this.setSprite(this.direction, this.speed);
  this.x = this.setEnemyX(this.direction);
  this.y = this.setEnemyY(this.direction);
  
  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  // this.sprite = 'images/enemy-bug.png';
}

Enemy.prototype.speedValues = [20, 40, 80, 160, 320];
Enemy.prototype.ordinateValues = [60, 143, 227, 310];
Enemy.prototype.spriteValues = [['images/char-boy.png', 'images/char-cat-girl.png'], ['images/char-horn-girl.png', 'images/char-pink-girl.png']];

// Set Enemy moving direction
// 1 - from left to right
// -1 - from right to left
Enemy.prototype.setDirection = function() {
  var direction = Math.floor(Math.random() * 2);
  return direction === 0 ? 1 : -1;
}

// Set Enemy moving speed to one of 5 levels multiple of 10
Enemy.prototype.setSpeed = function() {
  var speed = this.speedValues[Math.floor(Math.random() * 5)];
  return speed;
}

Enemy.prototype.setSprite = function(direction, speed) {
  var sprite = direction === 1 ? this.spriteValues[0] : this.spriteValues[1];
  sprite = speed > 80 ? sprite[0] : sprite[1];
  return sprite;
}

// Set Enemy starting position depending on their direction
Enemy.prototype.setEnemyX = function(direction) {
  var x = direction === 1 ? -(Math.floor(Math.random() * 200)) : (Math.floor(Math.random() * 200)) + 909;
  return x;
}

Enemy.prototype.setEnemyY = function() {
  var y = this.ordinateValues[Math.floor(Math.random() * 4)];
  return y;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  this.x += this.direction * this.speed * dt;
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function() {
  this.x = this.setPlayerX();
  this.y = this.setPlayerY();
  this.sprite = 'images/char-boy.png';
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
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = []
for (var enemy, i = 0; i < 20; i++) {
  enemy = new Enemy();
  allEnemies.push(enemy);
}

var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
