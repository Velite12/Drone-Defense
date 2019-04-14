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
        update: update
    }
};

var game = new Phaser.Game(config);

var map;
var player;
var cursors;
//var groundLayer, coinLayer;
var text;

function preload() {
    // map made with Tiled in JSON format
    this.load.image("tiles", "assets/tileset/custtiles1.png");
    this.load.tilemapTiledJSON('map', 'assets/tilemap/level1map.json');
    // tiles in spritesheet 
    
    
    // simple coin image
    //this.load.image('coin', 'assets/coinGold.png');
    // player animations
    this.load.image('player', 'assets/sprites/neighbor.png');
}

function create() {
    // load the map 
    map = this.make.tilemap({key: 'map'});

    // tiles for the ground layer
    
    // create the ground layer
    const tileset = map.addTilesetImage("custtiles1", "tiles");
    //tileset= map.createStaticLayer('BackLayer', tileset, 0, 0);
    
    // Parameters: layer name (or index) from Tiled, tileset, x, y
    
    const worldLayer = map.createStaticLayer("BackLayer", tileset, 0, 0);
    

    worldLayer.setCollisionByProperty({ collides: true });
    this.physics.world.bounds.width = worldLayer.width;
    this.physics.world.bounds.height = worldLayer.height;
}

function update() {

}