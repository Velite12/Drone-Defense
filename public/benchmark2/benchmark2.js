/* currently the only game elements added are:
weapons: rock
drone: level 1 drone
package: amazon package
*/

var clock;
var map;
var player;
var paused;

var cursors;
var worldLayer, boxLayer;


var score = 0;
var text1;
var text2;
var text3;
var text4;
var debugtext;

var level;
var diff;
var healthpoints;
var reticle;
var moveKeys;
var stacks; //will ramp up the spawnrate
var maxSpawnRate;
var intervalID;

//class groups
var playerBullets;
var enemyBullets;
var enemies;
var boxes;

var time; //actual time
var shotusedsingle = 1;
var maxAmmo;
var timescale; //time in normal form, scaled to be readable
var timeintervals;

/////////////////////////////////////////////////////////////////////////////////////////////////////////

var Bullet = new Phaser.Class({

  Extends: Phaser.GameObjects.Image,

  initialize:

    // Bullet Constructor
    function Bullet(scene) {
      Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');
      this.speed = 0.4;
      this.born = 0;
      this.direction = 0;
      this.xSpeed = 0;
      this.ySpeed = 0;
      this.setSize(12, 12, true);


    },

  // Fires a bullet from the player to the reticle
  fire: function(shooter, target) {

    this.setPosition(shooter.x, shooter.y - 15); // Initial position
    this.direction = Math.atan((target.x - this.x) / (target.y - this.y));
    this.body.setAllowGravity(true);

    // Calculate X and y velocity of bullet to moves it from shooter to target
    if (target.y >= this.y) {
      this.xSpeed = this.speed * Math.sin(this.direction);
      this.ySpeed = this.speed * Math.cos(this.direction);
      //this.body.setGravityY(400);
      //this.setCollideWorldBounds(true);
    } else {
      this.xSpeed = -this.speed * Math.sin(this.direction);
      this.ySpeed = -this.speed * Math.cos(this.direction);
      //this.body.setGravityY(400);
      //this.setCollideWorldBounds(true);
    }
    //this.body.setGravityY(0);
    //this.rotation = target.rotation; // angle bullet with shooters rotation
    this.born = 0; // Time since new bullet spawned

    shotusedsingle = 0;
    text2.setText("Ammo: " + shotusedsingle);


  },

  // Updates the position of the bullet each cycle
  update: function(time, delta) {

    this.x += this.xSpeed * delta;
    this.y += this.ySpeed * delta;
    this.born += delta;

    if (this.born > 1000) {
      //this.setActive(false);
      //this.setVisible(false);
      shotusedsingle = 1;
      text2.setText("Ammo: " + shotusedsingle);
      this.destroy();

    }

  }

});

////////////////////////////////////////////////////////////////////////////////////////////

var Box = new Phaser.Class({

  Extends: Phaser.GameObjects.Image,

  initialize:

    // Box Constructor
    function Box(scene) {
      //var boxsample = Phaser.GameObjects.Sprite.call(this, scene, 0, 0, 'box');
      Phaser.GameObjects.Image.call(this, scene, 0, 0, 'box');
      this.speed = 0.0;
      this.born = 0;
      this.direction = 0;
      this.xSpeed = 0;
      this.ySpeed = 2;
      this.scene = scene;
      this.worldlayer = worldLayer;
      this.setSize(14, 14, true);
      this.born;

    },



  spawnBox: function(posx, posy) {
    this.born = 1;
    this.setPosition(Math.floor(posx), Math.floor(posy) + 20);

    //this.body.setCollideWorldBounds(true);

  },

  update: function(time, delta) {
    if (this.born >= 1) {
      this.born += delta;
    }

    //debugtext.setText(this.born);
    if (this.born > 5000) {
      //this.setActive(false);
      //this.setVisible(false);
      //shotusedsingle = 1;
      //text2.setText("Ammo: "+shotusedsingle);
      player.health--;
      this.destroy();

    }

    //this.y += this.ySpeed;
    //this.scene.physics.add.collider(worldLayer, this);

  }

});

///////////////////////////////////////////////////////////////////////////////

var Enemy = new Phaser.Class({

  Extends: Phaser.GameObjects.Image,

  initialize:

    // Enemy Constructor
    function Enemy(scene) {
      Phaser.GameObjects.Image.call(this, scene, 0, 0, 'enemy');
      this.speed = 0.0;
      this.born = 0;
      this.direction = 0;
      this.xSpeed = 2;
      this.ySpeed = 2;
      this.destinationX = (150 + (Math.floor(Math.random() * 15) + 0)) * (Math.floor(Math.random() * 4) + 1);
      this.destinationY = 400;
      this.originX = Math.floor(Math.random() * 800) + 0;
      this.originY = Math.floor(Math.random() * 300) + 0;
      this.reachedDest = 0;
      this.scene = scene;
      this.setSize(12, 12, true);


    },

  spawnEnemy: function() {
    this.setPosition(this.originX, this.originY);


  },

  update: function(time, delta) {

    if (this.reachedDest == 0) { //has not reached destination
      if (this.x < this.destinationX - 10 || this.x > this.destinationX + 10) {
        if (this.x > this.destinationX)
          this.x -= this.xSpeed;
        else
          this.x += this.xSpeed;
      } else {
        this.x = this.destinationX;
        this.reachedDest = 1;




      }

    } else if (this.reachedDest == 1) {
      if (this.y != this.destinationY) {
        this.y += this.ySpeed;
        //this.xSpeed = 0;
      }
      if (this.y >= this.destinationY) {
        this.y = this.destinationY;
        this.reachedDest = 2;
        //this.ySpeed = 0;
      }

      //
    } else if (this.reachedDest == 2) { //has dropped the package
      var boxdrop = boxes.get().setActive(true).setVisible(true);
      boxdrop.spawnBox(this.x, this.y, this.scene);

      this.reachedDest = 3;
    } else if (this.reachedDest == 3) { //is now returning to base
      //this.ySpeed = 2;
      this.y -= this.ySpeed;
      if (this.y <= 5) {
        this.destroy();
      }
    }

    //debugtext.setText(delta);
  }

});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var GameScene = new Phaser.Class({

  Extends: Phaser.Scene,

  initialize:

    function GameScene() {
      Phaser.Scene.call(this, {
        key: 'gamescene'
      });
    },

  preload: function() {
    window.location.hash = "game";
    // map made with Tiled in JSON format
    this.load.image("tiles", "assets/tileset/custtiles1.png");
    this.load.tilemapTiledJSON('map', 'assets/tilemap/level1map.json');
    // tiles in spritesheet
    this.load.image("bullet", "assets/sprites/stone.png")
    this.load.image("target", "assets/sprites/reticle.png")
    // simple coin image
    this.load.image('box', 'assets/sprites/amazonpackage.png');
    this.load.image("enemy", 'assets/sprites/drone.png')
    // player animations
    //this.load.image('player', 'assets/sprites/neighbor.png');
    this.load.spritesheet('player', 'assets/sprites/neighborwalk.png', {
      frameWidth: 11,
      frameHeight: 25
    });
  },

  create: function() {
    // load the map
    map = this.make.tilemap({
      key: 'map'
    });
    level = 1;
    diff = 1; //easy
    maxSpawnRate = 5000 * diff * level;
    stacks = 0;
    timeintervals = [];

    const tileset = map.addTilesetImage("custtiles1", "tiles");

    //class declaring
    playerBullets = this.physics.add.group({
      key: 'bullet',
      gravityY: 300,
      classType: Bullet,
      runChildUpdate: true
    });

    boxes = this.physics.add.group({

      key: 'box',
      classType: Box,
      runChildUpdate: true,
      gravityY: 100,

    });

    enemies = this.physics.add.group({

      classType: Enemy,
      runChildUpdate: true
    });

    worldLayer = map.createDynamicLayer("BackLayer", tileset, 0, 0);

    moveKeys = this.input.keyboard.addKeys({

      'left': Phaser.Input.Keyboard.KeyCodes.A,
      'right': Phaser.Input.Keyboard.KeyCodes.D
    });
    worldLayer.setCollisionByProperty({
      collides: true
    });
    //boxLayer.setCollisionByProperty({ collides: true });
    this.physics.world.bounds.width = worldLayer.width - 5;
    this.physics.world.bounds.height = worldLayer.height - 65;

    // create the player sprite
    //player = this.physics.add.sprite(500, 500, 'player');
    const spawnPoint = map.findObject("PlayerLayer", obj => obj.name === "Spawn Point");
    player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, "player");
    reticle = this.physics.add.sprite(800, 700, 'target');

    reticle.body.setAllowGravity(false);


    player.setBounce(0.2); // our player will bounce from items
    player.setCollideWorldBounds(true); // don't go out of the map
    this.physics.add.collider(worldLayer, player);




    reticle.setOrigin(0.5, 0.5).setDisplaySize(25, 25).setCollideWorldBounds(true);
    cursors = this.input.keyboard.createCursorKeys();


    //this.physics.add.overlap(player, Box, collectBox, null, this);
    //this.physics.add.collider(worldLayer, Box);


    //bottom part of screen text
    //points
    text1 = this.add.text(400, 570, "Points: ", {
      fontSize: '20px',
      fill: '#ffffff'
    });
    text1.setScrollFactor(0);
    //ammo
    text2 = this.add.text(700, 570, 'Ammo: 1', {
      fontSize: '20px',
      fill: '#ffffff'
    });
    text2.setScrollFactor(0);
    //Health
    text3 = this.add.text(20, 570, '0', {
      fontSize: '20px',
      fill: '#ffffff'
    });
    text3.setScrollFactor(0);
    //Time
    text4 = this.add.text(550, 570, '0', {
      fontSize: '20px',
      fill: '#ffffff'
    });
    text4.setScrollFactor(0);
    //debug
    /*debugtext = this.add.text(250, 570, '0', {
        fontSize: '20px',
        fill: '#ffffff'
    });
    debugtext.setScrollFactor(0);*/


    // Set sprite variables
    player.health = 3;
    //enemy.health = 3;
    //enemy.lastFired = 0;

    // Fires bullet from player on left click of mouse



    // Pointer lock will only work after mousedown
    game.canvas.addEventListener('mousedown', function() {
      game.input.mouse.requestPointerLock();
    });

    // Exit pointer lock when Q or escape (by default) is pressed.
    this.input.keyboard.on('keydown_Q', function(event) {
      if (game.input.mouse.locked)
        game.input.mouse.releasePointerLock();
    }, 0, this);

    // Move reticle upon locked pointer move
    this.input.on('pointermove', function(pointer) {
      if (this.input.mouse.locked) {
        reticle.x += pointer.movementX;
        reticle.y += pointer.movementY;
      }
    }, this);

    this.input.on('pointerdown', function(pointer, time, lastFired) {
      if (player.active === false) {
        return;
      }

      if (shotusedsingle === 1) {
        var bullet = playerBullets.get().setActive(true).setVisible(true);
        if (bullet) {

          bullet.fire(player, reticle);

          this.physics.add.collider(bullet, enemies, this.destroyEnemy);
          this.physics.add.collider(bullet, worldLayer);
          shotusedsingle = 0;

          text2.setText("Ammo: " + shotusedsingle);

        }
      }

    }, this);



    //clock.addEvent({ delay: 5000,  loop: true, callback: spawnEnemy(), callbackScope: this});
    intervalID = window.setInterval(this.spawnEnemy, maxSpawnRate - stacks);
    timeintervals.push(intervalID);
  },

  update: function(time, delta) {
    const anims = this.anims;
    if (cursors.left.isDown) {
      anims.create({
        key: 'walk',
        frames: anims.generateFrameNumbers('player', {
          start: 1,
          end: 4
        }),
        frameRate: 10,
        repeat: -1
      });
      player.body.setVelocityX(-200); // move left
      player.anims.play('walk', true); // play walk animation
      player.flipX = true; // flip the sprite to the left
    } else if (cursors.right.isDown) {
      anims.create({
        key: 'walk',
        frames: anims.generateFrameNumbers('player', {
          start: 1,
          end: 4
        }),
        frameRate: 10,
        repeat: -1
      });
      player.body.setVelocityX(200); // move right
      player.anims.play('walk', true); // play walk animatio
      player.flipX = false; // use the original sprite looking to the right
    } else {
      anims.create({
        key: 'idle',
        frames: [{
          key: 'player',
          frame: 0
        }],
        frameRate: 20
      });
      player.body.setVelocityX(0);
      player.anims.play('idle', true);
    }
    //if (score%4 == 0 && score > 0)
    //  spawnBoxes();

    timescale = Math.floor(time / 500);
    text3.setText("Health: " + player.health);
    text4.setText("Time: " + timescale);
    this.physics.add.collider(boxes, worldLayer);
    //this.physics.add.collider(boxes, player);
    this.physics.add.overlap(player, boxes, this.collectBox, null, this);
    if (player.health == 0) {
      // Display word "Game Over" at center of the screen game
      var gameOverText = this.add.text(game.config.width / 4, game.config.height / 2, 'GAME OVER', {
        fontSize: '32px',
        fill: '#fff'
      });

      // Set z-index just in case your text show behind the background.
      gameOverText.setDepth(1);
      //game.lockRender = true;
      this.paused = 1;
      timeintervals.forEach(function(element) {
        clearInterval(element);
      });

      this.scene.pause();
    }
    //drone.spawnEnemy();
  },
  collectBox: function(player, box) {
    //boxLayer.removeTileAt(tile.x, tile.y); // remove the tile/coin
    box.destroy();
    score++;
    text1.setText("Points: " + score);
    //generates more boxes
    return false;
  },
  destroyEnemy: function(bullet, enemy) {
    //boxLayer.removeTileAt(tile.x, tile.y); // remove the tile/coin
    enemy.destroy();
    bullet.destroy();
    shotusedsingle = 1;
    text2.setText("Ammo: " + shotusedsingle);

    //playerBullets.get().setActive(false).setVisible(false);
    //bullet.destroy();
    if (stacks < maxSpawnRate - 10) {
      stacks += 10 * diff * level;
      if (stacks % (50 / diff) == 0) {
        intervalID = window.setInterval(this.spawnEnemy, maxSpawnRate - stacks);
        timeintervals.push(intervalID);
      }

    }
    score += 5;
    text1.setText("Points: " + score);
    return false;
  },
  spawnEnemy: function() {
    var drone = enemies.get().setActive(true).setVisible(true);
    drone.spawnEnemy();
    return false;
  }
});
