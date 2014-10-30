var Engine = (function(global) {
  var doc = global.document,
    win = global.window,
    canvas = doc.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    patterns = {},
    lastTime;

  canvas.width = 909;
  canvas.height = 707;
  $('#game-field').append(canvas);

  function main() {
    var now = Date.now(),
      dt = (now - lastTime) / 1000.0;

    update(dt);
    render();

    lastTime = now;
    win.requestAnimationFrame(main);
  };

  function init() {
    reset();
    lastTime = Date.now();
    main();
  }

  function update(dt) {
    updateEntities(dt);
    checkCollisions();
  }

  function updateEntities(dt) {
    level.update(dt);
    level.enemies.forEach(function(enemy) {
      enemy.update(dt);
    });
    level.obstacles.forEach(function(obstacle) {
      obstacle.update(dt);
    });
    player.update(dt);
  }

  function checkCollisions() {
    level.enemies.forEach(function(enemy) {
      if(Math.abs(enemy.x - player.x) <= 65 && Math.abs(enemy.y - player.y) <= 10) {
        player.die();
        console.log('player position: ' + player.x + ' player hp: ' + player.hp.value);
      }
    });
  }

  function render() {
    var rowImages = [
        'images/water-block.png',
        'images/stone-block.png',
        'images/stone-block.png',
        'images/stone-block.png',
        'images/stone-block.png',
        'images/grass-block.png',
        'images/grass-block.png'
      ],
      numRows = 7,
      numCols = 9,
      row, col;

    for (row = 0; row < numRows; row++) {
      for (col = 0; col < numCols; col++) {
        ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
      }
    }

    renderEntities();
  }

  function renderEntities() {
    level.obstacles.forEach(function(obstacle) {
      obstacle.render();
    });
    level.enemies.forEach(function(enemy) {
      enemy.render();
    });
    player.render();
    player.hp.render();
  }

  function reset() {
    // noop
  }

  Resources.load([
    'images/stone-block.png',
    'images/water-block.png',
    'images/grass-block.png',
    'images/enemy-bug.png',
    'images/char-boy.png',
    'images/char-cat-girl.png',
    'images/char-horn-girl.png',
    'images/char-pink-girl.png',
    'images/small-heart.png',
    'images/Rock.png'
  ]);
  Resources.onReady(init);

  global.ctx = ctx;
})(this);
