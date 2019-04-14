const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 500},
            debug: false
        }
    },
    scene: {
        key: 'main',
        preload: preload,
        create: create,
        update: update,
        collectBox: collectBox

    }
};

var game = new Phaser.Game(config);

var map;
var player;
var cursors;
var worldLayer, boxLayer;
var score = 0;
var text;
var boxes;
var level;
var diff;




function preload() {
    // map made with Tiled in JSON format
    this.load.image("tiles", "assets/tileset/custtiles1.png");
    this.load.tilemapTiledJSON('map', 'assets/tilemap/level1map.json');
    // tiles in spritesheet 
    
    
    // simple coin image
    this.load.image('box', 'assets/sprites/atlas/amazonpackage.png');
    // player animations
    //this.load.image('player', 'assets/sprites/neighbor.png');
    this.load.spritesheet('player', 'assets/sprites/atlas/neighborwalk.png', {frameWidth: 11, frameHeight: 25});
}

function create() {
    // load the map 
    map = this.make.tilemap({key: 'map'});
    level = 1; 
    diff = 1; //easy
    // tiles for the ground layer
    
    // create the ground layer
    const tileset = map.addTilesetImage("custtiles1", "tiles");
    //tileset= map.createStaticLayer('BackLayer', tileset, 0, 0);
    
    // Parameters: layer name (or index) from Tiled, tileset, x, y
    
    worldLayer = map.createDynamicLayer("BackLayer", tileset, 0, 0);
    
    

    worldLayer.setCollisionByProperty({ collides: true });
    //boxLayer.setCollisionByProperty({ collides: true });
    this.physics.world.bounds.width = worldLayer.width;
    this.physics.world.bounds.height = worldLayer.height;

    // create the player sprite    
    //player = this.physics.add.sprite(500, 500, 'player'); 
    const spawnPoint = map.findObject("PlayerLayer", obj => obj.name === "Spawn Point");
    player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, "player");
    player.setBounce(0.2); // our player will bounce from items
    player.setCollideWorldBounds(true); // don't go out of the map
    this.physics.add.collider(worldLayer, player);


    cursors = this.input.keyboard.createCursorKeys();

    boxes = this.physics.add.group({
        key: 'box',
        repeat: 50*diff*level,
        setXY: { x: 100, y: 300, stepX: 5 }
    });

    // coin image used as tileset
    //var boxTiles = this.physics.add.sprite(200, 200, "box");
    // add coins as tiles
    //boxLayer = map.createDynamicLayer("BoxLayer", boxTiles, 0, 0);
    //boxLayer.setTileIndexCallback(0, collectBox, this);    
    this.physics.add.overlap(player, boxes, collectBox, null, this);
    //boxTiles.setBounce(0.2);
    //boxes.setCollideWorldBounds(true);
    this.physics.add.collider(worldLayer, boxes);
    
    text = this.add.text(20, 570, '0', {
        fontSize: '20px',
        fill: '#ffffff'
    });
    text.setScrollFactor(0);
    
    

}

function update(time, delta) {   
    const anims = this.anims;
    if (cursors.left.isDown)
    {
        anims.create({
            key: 'walk',
            frames: anims.generateFrameNumbers('player', { start: 1, end: 4 }),
            frameRate: 10,
            repeat: -1
        });
        player.body.setVelocityX(-200); // move left
        player.anims.play('walk', true); // play walk animation
        player.flipX= true; // flip the sprite to the left
    }
    else if (cursors.right.isDown)
    {
        anims.create({
            key: 'walk',
            frames: anims.generateFrameNumbers('player', { start: 1, end: 4 }),
            frameRate: 10,
            repeat: -1
        });
        player.body.setVelocityX(200); // move right
        player.anims.play('walk', true); // play walk animatio
        player.flipX = false; // use the original sprite looking to the right
    } else {
        anims.create({
            key: 'idle',
            frames: [ { key: 'player', frame: 0 } ],
            frameRate: 20
        });
        player.body.setVelocityX(0);
        player.anims.play('idle', true);
    }
    //if (score%4 == 0 && score > 0)
      //  spawnBoxes();  
}
function collectBox(sprite, tile) {
    //boxLayer.removeTileAt(tile.x, tile.y); // remove the tile/coin
    tile.disableBody(true, true);
    score++;
    text.setText(score);
    //generates more boxes
    if (score%4 == 0 && score > 0 && score < 52){
        //respawns old boxes
        /*boxes.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });*/

        
        for(var i = 0; i < 4; i++){
            var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
            var newbox = boxes.create(x, 16, 'box');
            newbox.setBounce(0.2);
            newbox.setCollideWorldBounds(true);
            newbox.setVelocity(0, 20);
        }
        
    }
    return false;
}
