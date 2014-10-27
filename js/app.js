// Enemies our player must avoid
var Enemy = function() {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started
  this.direction = this.setDirection();
  this.speed = this.setSpeed();
  this.x = this.setStartX(this.direction);
  this.y = this.setStartY(this.direction);
  
  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = 'images/enemy-bug.png';
}

// Set Enemy moving direction
// 1 - from left to right
// -1 - from right to left
Enemy.prototype.setDirection = function() {
  var direction = Math.floor(Math.random() * 2);
  return direction === 0 ? 1 : -1;
}

Enemy.prototype.speedValues = [20, 40, 80, 160, 320];
Enemy.prototype.ordinateValues = [[55, 65], [140, 150], [225, 235], [310, 320]];

// Set Enemy moving speed to one of 5 levels multiple of 10
Enemy.prototype.setSpeed = function() {
  var speed = this.speedValues[Math.floor(Math.random() * 5)];
  return speed;
}

// Set Enemy starting position depending on their direction
Enemy.prototype.setStartX = function(direction) {
  var x = direction === 1 ? -(Math.floor(Math.random() * 200)) : (Math.floor(Math.random() * 200)) + 909;
  return x;
}

Enemy.prototype.setStartY = function(direction) {
  var y = direction === 1 ? this.ordinateValues[Math.floor(Math.random() * 4)][0] : this.ordinateValues[Math.floor(Math.random() * 4)][1];
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


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = []
for (var enemy, i = 0; i < 20; i++) {
  enemy = new Enemy();
  allEnemies.push(enemy);
}

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
