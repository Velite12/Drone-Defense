/* TODO: Enable boss
*/
//settings var
var clock;
var map;
var player;
var paused;

//important var
var cursors;
var worldLayer, boxLayer;
var bosspawned = false;
var sceneStarted = false;
var scene;

//ui var
var score = 0;
var text1;
var text2;
var text3;
var text4;
var text5;
var text6;
var text7;
var text8;
var weaponEquipped;
var speedEquipped;
var jumpEquipped;
var invincibilityEquipped;
var debugtext;


//game var
var weaponTypes = ['rock', 'bat', 'grenade', 'shotgun'];
var currentWeaponType = 'rock';
var powerupType = ['speed','jump','armor','invincibility']
var currentPowerups = {
  "speed":0,
  "jump":0,
  "invincibility":0,
};
var level = 1;
var diff;
var healthpoints;
var jump;
var reticle;
var moveKeys;
var stacks; //will ramp up the spawnrate
var maxSpawnRate;
var intervalID;
var invincibility = false;
var time; //actual time
var shotusedsingle = 1;
var shotusedmult = 0; //ammo for shotgun
var maxAmmo;
var timescale; //time in normal form, scaled to be readable
var timeintervals;
var enemySpeed = 2;
var progressionThreshold = 30; //amount of points needed to progress enemy difficulty in-level
var bosshealth = 50;
var bossdefeated = false;

//class groups
var playerBullets;
var enemyBullets;
var enemies;
var boxes;
var bosses;
var powerdur = 2500;


/////////////////////////////////////////////////////////////////////////////////////////////////////////

var Bullet = new Phaser.Class({

  Extends: Phaser.GameObjects.Image,

  initialize:

    // Bullet Constructor
    function Bullet(scene, key, size) {
      Phaser.GameObjects.Image.call(this, scene, 0, 0, key);
      this.speed = 0.4;
      this.type = key;
      this.born = 0;
      this.bornlimit = 0;
      this.direction = 0;
      this.xSpeed = 0;
      this.ySpeed = 0;
      this.setSize(size, size, true);



    },

  // Fires a bullet from the player to the reticle
  fire: function(shooter, target, gravity) {
    this.body.setAllowGravity(gravity);
    this.setPosition(shooter.x, shooter.y - 15); // Initial position
    this.direction = Math.atan((target.x - this.x) / (target.y - this.y));


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

    if (this.born > this.bornlimit) {
      //this.setActive(false);
      //this.setVisible(false);
      if (this.type == 'bullet'){
        shotusedsingle = 1;
        text2.setText("Ammo: " + shotusedsingle);
        playerBullets.remove(this, true, true);
      }
      else if (this.type == 'spread'){
        text2.setText("Ammo: " + shotusedmult);
        playerBullets.remove(this, true, true);
      }


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
      this.type = this.generateType();
      Phaser.GameObjects.Image.call(this, scene, 0, 0, this.type);
      this.speed = 0.0;
      this.born = 0;
      this.direction = 0;
      this.xSpeed = 0;
      this.ySpeed = 2;
      this.posX;
      this.posY;
      this.scene = scene;
      this.worldlayer = worldLayer;
      this.invinc = false;
      this.setSize(14, 14, true);
      this.born;
      this.weapon = this.getRandomInt(1,10);
    },


  generateType: function(){
      var selection = Math.floor(Math.random() * 101);
      if(selection > 89){
        var selection = this.getRandomInt(0,powerupType.length-1);
        return powerupType[selection];
      }else{
        return 'box';
      }
      return 'box';
  },

  spawnBox: function(posx, posy, invinc) {
    this.born = 1;
    this.setPosition(Math.floor(posx), Math.floor(posy) + 20);
    this.posX = posx;
    this.posY = posy;

    this.invinc = invinc;
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
      if (!player.invincibility){
        player.health--;
      }

      boxes.remove(this, true, true);

    }

    //this.y += this.ySpeed;
    //this.scene.physics.add.collider(worldLayer, this);

  },
  getRandomInt: function(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

});

///////////////////////////////////////////////////////////////////////////////

var Enemy = new Phaser.Class({

  Extends: Phaser.GameObjects.Sprite,

  initialize:

    // Enemy Constructor
    function Enemy(scene) {
      Phaser.GameObjects.Sprite.call(this, scene, 0, 0, 'enemy');
      this.speed = 0.0;
      this.born = 0;
      this.direction = 0;
      this.xSpeed = 2;
      this.ySpeed = 2;
      this.invinc = false;
      this.destinationX = (150 + (Math.floor(Math.random() * 15) + 0)) * (Math.floor(Math.random() * 4) + 1);
      this.destinationY = 400;
      this.originX = Math.floor(Math.random() * 2) + 0;
      this.originY = Math.floor(Math.random() * 300) + 5;
      this.reachedDest = 0;
      this.scene = scene;
      this.setSize(16, 16, true);


    },

  spawnEnemy: function(invincibility, speed) {
    this.invinc = player.invincibility;
    this.xSpeed = speed;
    this.ySpeed = speed;
    this.setPosition(800*(this.originX), this.originY);


  },
  spawnEnemyBoss: function(posx, posy, invinc) {
    this.invinc = invinc;
    this.xSpeed = 2;
    this.ySpeed = 2;
    this.setPosition(posx, posy);


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
      var boxdrop = boxes.get();
      boxdrop.spawnBox(this.x, this.y, player.invincibility);

      this.reachedDest = 3;
    } else if (this.reachedDest == 3) { //is now returning to base
      //this.ySpeed = 2;
      this.y -= this.ySpeed;
      if (this.y <= 5) {
        enemies.remove(this, true, true);
      }
    }

    //debugtext.setText(delta);
  }

});

///////////////////////////////////////////////////////////////////////////////

var Boss = new Phaser.Class({

  Extends: Phaser.GameObjects.Image,

  initialize:

    // Boss Constructor
    function Boss(scene) {
      Phaser.GameObjects.Image.call(this, scene, 0, 0, 'boss');
      this.setDepth(0);
      this.speed = 0.0;
      this.born = 0;
      this.direction = 0;
      this.xSpeed = 2;
      this.ySpeed = 0;
      this.health = 100;
      this.invinc = false;
      this.destination1 = 600;
      this.destination2= 200;
      this.originX = 400;
      this.originY = 100;
      this.reachedDest = 0;
      this.scene = scene;
      this.setSize(190, 130, true);


    },

  spawnBoss: function(invincibility, speed) {
    this.invinc = player.invincibility;
    this.xSpeed = speed;
    this.setPosition(this.originX, this.originY);


  },

  update: function(time, delta) {

    if(this.reachedDest == 0){ //has not moved yet
      this.reachedDest  = this.getRandomInt(1,2);
    }
    else if (this.reachedDest == 1){ //heading right
      this.x += this.xSpeed;
      if (this.x > this.destination1){
        this.reachedDest = 2;
        
        for(var i = 0; i < 2; i++){
          var enemySpawn = enemies.get();
          enemySpawn.spawnEnemyBoss(this.x+30*i, this.y+45, player.invincibility);
        }
        for(var i = 0; i < 2; i++){
          var enemySpawn = enemies.get();
          enemySpawn.spawnEnemyBoss(this.x-30*i, this.y+45, player.invincibility);
        }
        
      }
    }
    else if (this.reachedDest == 2){ //heading left
      this.x -= this.xSpeed;
      if (this.x < this.destination2){
        this.reachedDest = 1;
      }
    }

    //debugtext.setText(delta);
  },
  getRandomInt: function(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var GameScene1 = new Phaser.Class({

  Extends: Phaser.Scene,

  initialize:

    function GameScene() {
      Phaser.Scene.call(this, {
        key: 'gamescene1'
      });
    },

  preload: function() {
    level = 1;
    time = 0;
    window.location.hash = "gamescene1";

    this.load.audio('bgmusic1', ['assets/audio/lvl1.mp3', 'assets/audio/lvl1.ogg']);
    this.load.audio('bullet', ['assets/audio/rock.mp3', 'assets/audio/rock.ogg']);
    this.load.audio('box', ['assets/audio/box.mp3', 'assets/audio/box.ogg']);
    this.load.audio('end', ['assets/audio/end.mp3', 'assets/audio/end.ogg']);
    this.load.audio('sad', ['assets/audio/sad.mp3', 'assets/audio/sad.ogg']);
    this.load.audio('smash', ['assets/audio/smash.mp3', 'assets/audio/smash.ogg']);

    // map made with Tiled in JSON format
    this.load.image("tiles", "assets/tileset/custtiles1.png");
    this.load.tilemapTiledJSON('map', 'assets/tilemap/level1map.json');
    // tiles in spritesheet
    this.load.image("bullet", "assets/sprites/stone.png");
    this.load.image("stone", "assets/sprites/stone.png");
    this.load.image("spread", "assets/sprites/shotgunspread.png");
    this.load.image("shotgun", "assets/sprites/shotgun.png");
    this.load.image("target", "assets/sprites/reticle.png");
    // simple coin image
    this.load.image('box', 'assets/sprites/amazonpackage.png');
    this.load.image('speed', 'assets/sprites/speed.png');
    this.load.image('jump', 'assets/sprites/jump.png');
    this.load.image('armor', 'assets/sprites/armor.png');
    this.load.image("invincibility", 'assets/sprites/invincibility.png');
    this.load.image("enemy", 'assets/sprites/drone.png');
    this.load.image("boss", 'assets/sprites/blimpboss.png');
    // player animations
    //this.load.image('player', 'assets/sprites/neighbor.png');
    this.load.spritesheet('player', 'assets/sprites/neighborwalk.png', {
      frameWidth: 11,
      frameHeight: 25
    });
    this.load.image('dronedeath', 'assets/sprites/droneDying.png');
  },

  create: create,
  update: update,
  collectBox: collectBox,
  destroyEnemy: destroyEnemy,
  spawnEnemy: spawnEnemy,
  collectShotgun: collectShotgun,
  spawnBoss: spawnBoss,
  destroyBoss: destroyBoss
});

var GameScene2 = new Phaser.Class({

  Extends: Phaser.Scene,

  initialize:

    function GameScene() {
      Phaser.Scene.call(this, {
        key: 'gamescene2'
      });
    },

  preload: function() {
    level = 2;
    time = 0;
    window.location.hash = "gamescene2";

    this.load.audio('bgmusic2', ['assets/audio/lvl2.mp3', 'assets/audio/lvl2.ogg']);
    this.load.audio('bullet', ['assets/audio/rock.mp3', 'assets/audio/rock.ogg']);
    this.load.audio('box', ['assets/audio/box.mp3', 'assets/audio/box.ogg']);
    this.load.audio('end', ['assets/audio/end.mp3', 'assets/audio/end.ogg']);
    this.load.audio('sad', ['assets/audio/sad.mp3', 'assets/audio/sad.ogg']);
    this.load.audio('smash', ['assets/audio/smash.mp3', 'assets/audio/smash.ogg']);

    // map made with Tiled in JSON format
    this.load.image("tiles", "assets/tileset/custtiles2.png");
    this.load.tilemapTiledJSON('map', 'assets/tilemap/level2map.json');
    // tiles in spritesheet
    this.load.image("bullet", "assets/sprites/stone.png")
    this.load.image("target", "assets/sprites/reticle.png")
    // simple coin image
    this.load.image("stone", "assets/sprites/stone.png");
    this.load.image("shotgun", "assets/sprites/shotgun.png");
    this.load.image("spread", "assets/sprites/shotgunspread.png");
    this.load.image('box', 'assets/sprites/amazonpackage.png');
    this.load.image('speed', 'assets/sprites/speed.png');
    this.load.image('jump', 'assets/sprites/jump.png');
    this.load.image('armor', 'assets/sprites/armor.png');
    this.load.image("invincibility", 'assets/sprites/invincibility.png');
    this.load.image("enemy", 'assets/sprites/drone.png');
    this.load.image("boss", 'assets/sprites/blimpboss.png');
    // player animations
    //this.load.image('player', 'assets/sprites/neighbor.png');
    this.load.spritesheet('player', 'assets/sprites/neighborwalk.png', {
      frameWidth: 11,
      frameHeight: 25
    });
    this.load.image('dronedeath', 'assets/sprites/droneDying.png');
  },

  create: create,
  update: update,
  collectBox: collectBox,
  destroyEnemy: destroyEnemy,
  spawnEnemy: spawnEnemy,
  collectShotgun: collectShotgun,
  spawnBoss: spawnBoss,
  destroyBoss: destroyBoss
});

var GameScene3 = new Phaser.Class({

  Extends: Phaser.Scene,

  initialize:

    function GameScene() {
      Phaser.Scene.call(this, {
        key: 'gamescene3'
      });
    },

  preload: function() {
    level = 3;
    time = 0;
    window.location.hash = "gamescene3";

    this.load.audio('bgmusic3', ['assets/audio/lvl3.mp3', 'assets/audio/lvl3.ogg']);
    this.load.audio('bullet', ['assets/audio/rock.mp3', 'assets/audio/rock.ogg']);
    this.load.audio('box', ['assets/audio/box.mp3', 'assets/audio/box.ogg']);
    this.load.audio('end', ['assets/audio/end.mp3', 'assets/audio/end.ogg']);
    this.load.audio('sad', ['assets/audio/sad.mp3', 'assets/audio/sad.ogg']);
    this.load.audio('smash', ['assets/audio/smash.mp3', 'assets/audio/smash.ogg']);

    // map made with Tiled in JSON format
    this.load.image("tiles", "assets/tileset/custtiles3.png");
    this.load.tilemapTiledJSON('map', 'assets/tilemap/level3map.json');
    // tiles in spritesheet
    this.load.image("bullet", "assets/sprites/stone.png");
    this.load.image("stone", "assets/sprites/stone.png");
    this.load.image("shotgun", "assets/sprites/shotgun.png");
    this.load.image("target", "assets/sprites/reticle.png");
    this.load.image("spread", "assets/sprites/shotgunspread.png");
    this.load.image('box', 'assets/sprites/amazonpackage.png');
    this.load.image('speed', 'assets/sprites/speed.png');
    this.load.image('jump', 'assets/sprites/jump.png');
    this.load.image('armor', 'assets/sprites/armor.png');
    this.load.image("invincibility", 'assets/sprites/invincibility.png');
    this.load.image("enemy", 'assets/sprites/drone.png');
    this.load.image("boss", 'assets/sprites/blimpboss.png');
    // player animations
    //this.load.image('player', 'assets/sprites/neighbor.png');
    this.load.spritesheet('player', 'assets/sprites/neighborwalk.png', {
      frameWidth: 11,
      frameHeight: 25
    });
    this.load.image('dronedeath', 'assets/sprites/droneDying.png');
  },

  create: create,
  update: update,
  collectBox: collectBox,
  destroyEnemy: destroyEnemy,
  spawnEnemy: spawnEnemy,
  collectShotgun: collectShotgun,
  spawnBoss: spawnBoss,
  destroyBoss: destroyBoss
});


////////////////////////////////////////////////////////////////////////////
// CORE GAME FUNCTIONS
////////////////////////////////////////////////////////////////////////////




function create() {
  // load the map
  map = this.make.tilemap({
    key: 'map'
  });
  diff = 1; //easy
  maxSpawnRate = 5000 * diff * level;
  enemySpeed = enemySpeed*diff;
  stacks = 1;
  timeintervals = [];
  bosshealth*= level;
  var tileset;

  switch(level){
    case 1:
      tileset = map.addTilesetImage("custtiles1", "tiles");
      music1= this.sound.add('bgmusic1');
      music1.setLoop(true);
      music1.play();
      break;
    case 2:
      tileset = map.addTilesetImage("custtiles2", "tiles");
      music2 = this.sound.add('bgmusic2');
      music2.setLoop(true);
      music2.play();
      break;
    case 3:
      tileset = map.addTilesetImage("custtiles3", "tiles");
      music3 = this.sound.add('bgmusic3');
      music3.setLoop(true);
      music3.play();
      break;
  }

  //class declaring
  playerBullets = this.physics.add.group({
    gravityY: 300,
    classType: Bullet,
    runChildUpdate: true
  });

  boxes = this.physics.add.group({

    classType: Box,
    runChildUpdate: true,
    gravityY: 100

  });

  enemies = this.physics.add.group({

    classType: Enemy,
    runChildUpdate: true
  });
  bosses = this.physics.add.group({

    classType: Boss,
    runChildUpdate: true
  });


  worldLayer = map.createDynamicLayer("BackLayer", tileset, 0, 0);

  moveKeys = this.input.keyboard.addKeys({
    'left': Phaser.Input.Keyboard.KeyCodes.A,
    'right': Phaser.Input.Keyboard.KeyCodes.D,
    'up': Phaser.Input.Keyboard.KeyCodes.W
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
  player.currentWeaponType = currentWeaponType;
  player.invincibility = invincibility;
  this.physics.add.collider(worldLayer, player);
  
  reticle.setOrigin(0.5, 0.5).setDisplaySize(25, 25).setCollideWorldBounds(true);
  reticle.setDepth(3);
  cursors = this.input.keyboard.createCursorKeys();


  //this.physics.add.overlap(player, Box, collectBox, null, this);
  //this.physics.add.collider(worldLayer, Box);


  //bottom part of screen text
  //points
  text1 = this.add.text(400, 570, "Points: "+score, {
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

  weaponEquipped = this.physics.add.image(250, 580, "stone");
  weaponEquipped.setScrollFactor(0);
  //debug
  /*debugtext = this.add.text(250, 570, '0', {
      fontSize: '20px',
      fill: '#ffffff'
  });
  debugtext.setScrollFactor(0);*/

  text5 = this.add.text(700, 10, 'Powerups', {
    fontSize: '20px',
    fill: '#ffffff'
  });
  text5.setScrollFactor(0);

  speedEquipped = this.physics.add.image(735, 40, "speed");
  speedEquipped.setScrollFactor(0);

  text6 = this.add.text(755, 35, '00%', {
    fontSize: '15px',
    fill: '#ffffff'
  });
  text6.setScrollFactor(0);

  jumpEquipped = this.physics.add.image(735, 70, "jump");
  jumpEquipped.setScrollFactor(0);

  text7 = this.add.text(755, 65, '00%', {
    fontSize: '15px',
    fill: '#ffffff'
  });
  text7.setScrollFactor(0);

  invincibilityEquipped = this.physics.add.image(735, 100, "invincibility");
  invincibilityEquipped.setScrollFactor(0);

  text8 = this.add.text(755, 95, '00%', {
    fontSize: '15px',
    fill: '#ffffff'
  });
  text8.setScrollFactor(0);

  // Set sprite variables
  player.health = 3;
  player.speed = 175;
  player.body.setGravityY(300);
  jump = false;
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

  //toggle invincibility
  this.input.keyboard.on('keydown_I', function(event) {
    
      player.invincibility = true;
      invincibility =  true;
      player.health = 500;
    

    console.log("invincibility: ",player.invincibility);
  }, 0, this);

  this.input.keyboard.on('keydown_ZERO', function(event) {
    switch(level){
      case 1:
        music1.stop();
        break;
      case 2:
        music2.stop();
        break;
      case 3:
        music3.stop();
        break;
    }

    window.location.hash = 'mainmenu';
    location.reload();
  }, 0, this);

  this.input.keyboard.on('keydown_ONE', function(event) {
    switch(level){
      case 1:
        music1.stop();
        break;
      case 2:
        music2.stop();
        break;
      case 3:
        music3.stop();
        break;
    }

    window.location.hash = 'gamescene1';
    location.reload();
  }, 0, this);

  this.input.keyboard.on('keydown_TWO', function(event) {
    switch(level){
      case 1:
        music1.stop();
        break;
      case 2:
        music2.stop();
        break;
      case 3:
        music3.stop();
        break;
    }

    window.location.hash = 'gamescene2';
    location.reload();
  }, 0, this);

  this.input.keyboard.on('keydown_THREE', function(event) {
    switch(level){
      case 1:
        music1.stop();
        break;
      case 2:
        music2.stop();
        break;
      case 3:
        music3.stop();
        break;
    }

    window.location.hash = 'gamescene3';
    location.reload();
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
    if (pointer.rightButtonDown() == false){
      if (shotusedmult == 0){
        if(player.currentWeaponType == "rock"){
          if (shotusedsingle == 1) {
            var bullet = playerBullets.get('bullet',12).setActive(true).setVisible(true);



              bullet.bornlimit = 1000;
              this.sound.add('bullet').play();
              bullet.fire(player, reticle, true);

              this.physics.add.collider(bullet, enemies, this.destroyEnemy);
              this.physics.add.collider(bullet, bosses, this.destroyBoss);
              this.physics.add.collider(bullet, worldLayer);
              shotusedsingle = 0;

              text2.setText("Ammo: " + shotusedsingle);
            }
        }
      }

      else if (shotusedmult > 0){
        var bullet = playerBullets.get('spread',35).setActive(true).setVisible(true);
        bullet.bornlimit = 2000;
        this.sound.add('bullet').play();
        bullet.fire(player, reticle, false);

        this.physics.add.collider(bullet, enemies, this.destroyEnemy);
        this.physics.add.collider(bullet, bosses, this.destroyBoss);
        this.physics.add.collider(bullet, worldLayer);
        shotusedmult--;

        text2.setText("Ammo: " + shotusedmult);
        if(shotusedmult == 0){
          player.currentWeaponType = 'rock';
          shotusedsingle = 1;
          weaponEquipped.destroy();
          weaponEquipped = this.physics.add.image(250, 580, 'bullet');
          weaponEquipped.setScrollFactor(0);
          text2.setText("Ammo: " + shotusedsingle);
          console.log("out of shotgun ammo");
        }
      }
    }
    else if (pointer.rightButtonDown() == true){
      if (shotusedmult > 0){
        if (player.currentWeapontType == 'rock'){
          player.currentWeaponType == 'shotgun'
        }
        else{
          player.currentWeapontType == 'rock'
        }
      }
    }






  }, this);

  //clock.addEvent({ delay: 5000,  loop: true, callback: spawnEnemy(), callbackScope: this});

  intervalID = window.setInterval(this.spawnEnemy, maxSpawnRate);
  timeintervals.push(intervalID);
  time = 0;
}

function update(time, delta) {
    const anims = this.anims;
    if(time > 0 && sceneStarted == false){
      time = 0;
      sceneStarted = true;
    }
    if(cursors.up.isDown && jump) {
      player.body.setVelocityY(-100);
    }

    if (cursors.left.isDown) {
      if (this.game.input.pointers[0].isDown) {
        anims.create({
          key: 'walkshoot',
          frames: anims.generateFrameNumbers('player', {
            start: 5,
            end: 8
          }),
          frameRate: 5,
          repeat: -1
        });
        player.body.setVelocityX(-player.speed); // move left
        player.anims.play('walkshoot', true); // play walk animation
        player.flipX = true; // flip the sprite to the left
      }
      else{
        anims.create({
          key: 'walk',
          frames: anims.generateFrameNumbers('player', {
            start: 1,
            end: 4
          }),
          frameRate: 5,
          repeat: -1
        });
        player.body.setVelocityX(-player.speed); // move left
        player.anims.play('walk', true); // play walk animation
        player.flipX = true; // flip the sprite to the left
      }

    } else if (cursors.right.isDown) {
      if (this.game.input.pointers[0].isDown) {
        anims.create({
          key: 'walkshoot',
          frames: anims.generateFrameNumbers('player', {
            start: 5,
            end: 8
          }),
          frameRate: 5,
          repeat: -1
        });
        player.body.setVelocityX(player.speed); // move left
        player.anims.play('walkshoot', true); // play walk animation
        player.flipX = false; // flip the sprite to the left
      }
      else{
        anims.create({
          key: 'walk',
          frames: anims.generateFrameNumbers('player', {
            start: 1,
            end: 4
          }),
          frameRate: 5,
          repeat: -1
        });
        player.body.setVelocityX(player.speed); // move right
        player.anims.play('walk', true); // play walk animatio
        player.flipX = false; // use the original sprite looking to the right
      }

    } else {
      if (this.game.input.pointers[0].isDown) {
        anims.create({
          key: 'idleshoot',
          frames: anims.generateFrameNumbers('player', {
            start: 5,
            end: 8
          }),
          frameRate: 5,
          repeat: -1
        });
        player.body.setVelocityX(0);
        player.anims.play('idleshoot', true); // play walk animation
      }
      else{
        anims.create({
          key: 'idle',
          frames: [{
            key: 'player',
            frame: 0
          }],
          frameRate: 5
        });
        player.body.setVelocityX(0);
        player.anims.play('idle', true);
      }

    }
    //if (score%4 == 0 && score > 0)
    //  spawnBoxes();

    timescale = Math.floor(time / 500);
    text3.setText("Health: " + player.health);
    text4.setText("Time: " + timescale);
    this.physics.add.collider(boxes, worldLayer, function(boxes){
      boxes.body.setAllowGravity(false);
      boxes.body.y = (boxes.body.y-3);
    });
    //this.physics.add.collider(boxes, player);
    this.physics.add.overlap(player, boxes, this.collectBox, null, this);

    if(currentPowerups.speed > 0){
      // console.log('speed: '+currentPowerups.speed);
      player.speed = 225;
      currentPowerups.speed--;
    }else{
      player.speed = 175;
    }

    if(currentPowerups.jump >  0){
      // console.log('jump: '+currentPowerups.jump);
      jump = true;
      currentPowerups.jump--;
    }else{
      jump = false
    }

    if(currentPowerups.armor > 0){
      if(player.health + 1 < 6){
          player.health += 1;
      }else{
          player.health = 5;
      }

      text3.setText("Health: " + player.health);
      currentPowerups.armor = 0;
    }
    if (!invincibility){
      if (currentPowerups.invincibility > 0) {
        // console.log('invin:' + currentPowerups.invincibility);
        player.invincibility = true;
        currentPowerups.invincibility--;
      }else{
        player.invincibility = false;
      }
    }
    

    text6.setText(Math.floor((currentPowerups.speed/powerdur)*100)+"%");
    text7.setText(Math.floor((currentPowerups.jump/powerdur)*100)+"%");
    text8.setText(Math.floor((currentPowerups.invincibility/(powerdur/2))*100)+"%");

    if (player.health == 0) {
      // Display word "Game Over" at center of the screen game
      var gameOverText = this.add.text(game.config.width / 4, game.config.height / 2, 'GAME OVER\n Press Ctrl+R to restart', {
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

      switch(level){
        case 1:
          music1.stop();
          break;
        case 2:
          music2.stop();
          break;
        case 3:
          music3.stop();
          break;
      }

      //musicEnd= this.sound.add('end');
      musicEnd1= this.sound.add('sad');
      //musicEnd.setLoop(true);
      musicEnd1.setLoop(true);
     // musicEnd.play();
      musicEnd1.play();


      this.scene.pause();
    }
    if (score >= 300 && level == 1) {
      
      var victoryText = this.add.text(game.config.width / 4, game.config.height / 2, 'Level Cleared! Score: '+Math.ceil(score/timescale), {
        fontSize: '32px',
        fill: '#fff'
      });

      // Set z-index just in case your text show behind the background.
      victoryText.setDepth(1);
      //game.lockRender = true;
      this.paused = 1;
      timeintervals.forEach(function(element) {
        clearInterval(element);
      });
      intervalID = window.setInterval(function(){
        window.location.hash = 'gamescene2';
        location.reload();
      }, 2500);
      switch(level){
        case 1:
          music1.stop();
          break;
        case 2:
          music2.stop();
          break;
        case 3:
          music3.stop();
          break;
      }

      musicEnd= this.sound.add('end');
      //musicEnd1= this.sound.add('sad');
      musicEnd.setLoop(true);
     //musicEnd1.setLoop(true);
      musicEnd.play();
      //musicEnd1.play();


      this.scene.pause();
    }
    if (score >= 300 && (level == 2 || level == 3) && bosspawned == false) {
      // Display word "Game Over" at center of the screen game
      var incomingText = this.add.text(game.config.width / 4, game.config.height / 2, 'Incoming!', {
        fontSize: '32px',
        fill: '#fff'
      });

      // Set z-index just in case your text show behind the background.
      incomingText.setDepth(1);
      //game.lockRender = true;
      
      timeintervals.forEach(function(element) {
        clearInterval(element);
      });
      intervalID = window.setTimeout(function(){
        incomingText.setVisible(false);
        this.spawnBoss();
      }, 2500);
      bosspawned = true;
    }
    if(bossdefeated){
      score += 500;
      text1.setText("Points: " + score);
      var victoryText = this.add.text(game.config.width / 4, game.config.height / 2, 'Level Cleared! Score: '+Math.ceil(score/timescale), {
        fontSize: '32px',
        fill: '#fff'
      });

      // Set z-index just in case your text show behind the background.
      victoryText.setDepth(1);
      //game.lockRender = true;
      this.paused = 1;
      timeintervals.forEach(function(element) {
        clearInterval(element);
      });
      intervalID = window.setInterval(function(){
        if (level == 2){
          window.location.hash = 'gamescene3';
          
          location.reload();
        }
        else{
          window.location.hash = 'mainmenu';
          
          location.reload();
        }
        
      }, 2500);
      switch(level){
        case 1:
          music1.stop();
          break;
        case 2:
          music2.stop();
          break;
        case 3:
          music3.stop();
          break;
      }

      musicEnd= this.sound.add('end');
      //musicEnd1= this.sound.add('sad');
      musicEnd.setLoop(true);
    //musicEnd1.setLoop(true);
      musicEnd.play();
      //musicEnd1.play();


      this.scene.pause();
    }

}

function collectBox(player, box) {
  //boxLayer.removeTileAt(tile.x, tile.y); // remove the tile/coin
  this.sound.add('bullet').play();
  

  switch (box.texture.key) {
    case 'speed':
        currentPowerups.speed = powerdur;
        currentPowerups.jump = 0;
        currentPowerups.invincibility = 0;
    break;
    case 'jump':
      currentPowerups.jump = powerdur;
      currentPowerups.speed = 0;
      currentPowerups.invincibility = 0;
    break;
    case 'armor':
      currentPowerups.armor = powerdur;
    break;
    case 'invincibility':
      currentPowerups.invincibility = powerdur/2;
      currentPowerups.jump = 0;
      currentPowerups.speed = 0;
    break;
    default:
      if (box.weapon == 1){
        player.currentWeaponType = 'shotgun';
        shotusedmult+=10;
        weaponEquipped.destroy();
        weaponEquipped = this.physics.add.image(250, 580, 'shotgun');
        weaponEquipped.setScrollFactor(0);
        text2.setText("Ammo: " + shotusedmult);
        console.log("shotgun added");
      }
      score++;
  }
  

  boxes.remove(box, true, true);
  if(boxes.countActive(true) == 0){
    console.log("cleared");
    boxes.clear(true,true)
  }
  text1.setText("Points: " + score);
  //generates more boxes

  return false;
}

function destroyEnemy(bullet, enemy) {
    //boxLayer.removeTileAt(tile.x, tile.y); // remove the tile/coin
    game.sound.add('bullet').play();
      enemies.remove(enemy, true, true);
      if(bullet.type == "bullet"){
        bullet.destroy();
      }

      if (shotusedmult == 0){
        shotusedsingle = 1;
        text2.setText("Ammo: " + shotusedsingle);
      }
      else{
        text2.setText("Ammo: " + shotusedmult);
      }
      if (score > progressionThreshold*stacks) {
          if (enemySpeed < 2*diff+level){
            enemySpeed+=.5;
            console.log("enemies are faster");
          }
          if(score < 4000){
            intervalID = window.setInterval(this.spawnEnemy, maxSpawnRate - progressionThreshold*stacks);
            if(stacks < 2+diff+level){
              stacks++;
            }

            console.log("new wave added");
            console.log(intervalID);
            timeintervals.push(intervalID);
          }
      }
      score += 5;
      text1.setText("Points: " + score);
     
    
    
    return false;
   
}

function spawnEnemy(){

  for(var i = 0; i < stacks; i++){
    var drone = enemies.get().setActive(true).setVisible(true);
    drone.spawnEnemy(invincibility,enemySpeed);
  }

  return false;
}

function collectShotgun(player, box) {
  //boxLayer.removeTileAt(tile.x, tile.y); // remove the tile/coin
  this.sound.add('bullet').play();
  boxes.remove(box, true, true);
  score++;
  text1.setText("Points: " + score);
  //generates more boxes
  return false;
}

function spawnBoss(){

  var boss = bosses.get().setActive(true).setVisible(true);
  boss.spawnBoss(invincibility,enemySpeed);


  return false;
}

function destroyBoss(bullet, scene) {
  //boxLayer.removeTileAt(tile.x, tile.y); // remove the tile/coin
  game.sound.add('bullet').play();
  bullet.destroy();
  if (shotusedmult == 0){
    shotusedsingle = 1;
    text2.setText("Ammo: " + shotusedsingle);
  }
  else{
    text2.setText("Ammo: " + shotusedmult);
  }
  bosshealth-=2;
  if (bosshealth <= 0){
    bossdefeated = true;
  }
  console.log(bosshealth);

  
  return false;
}
