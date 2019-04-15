var MainMenu = new Phaser.Class({

  Extends: Phaser.Scene,

  initialize:

    function MainMenu() {
      Phaser.Scene.call(this, {
        key: 'mainmenu'
      });
    },

    preload: function() {
      // map made with Tiled in JSON format
      this.load.image("tiles", "assets/tileset/custtiles1.png");
      this.load.tilemapTiledJSON('map', 'assets/tilemap/level1map.json');
    },

    create: function() {

      map = this.make.tilemap({
        key: 'map'
      });
      level = 1;
      diff = 1; //easy

      const tileset = map.addTilesetImage("custtiles1", "tiles");
      worldLayer = map.createDynamicLayer("BackLayer", tileset, 0, 0);

    // add tutorial and start button
    this.newgame = this.addButton(400, 260, 'sprites', this.doStart, this, 'btn_quest_hl', 'btn_quest', 'btn_quest_hl', 'btn_quest');
    this.levelsel = this.addButton(320, 320, 'sprites', this.doLevel, this, 'btn_play_hl', 'btn_play', 'btn_play_hl', 'btn_play');
    this.controls = this.addButton(320, 380, 'sprites', this.doControls, this, 'btn_quest_hl', 'btn_quest', 'btn_quest_hl', 'btn_quest');
    this.settings = this.addButton(480, 320, 'sprites', this.doSettings, this, 'btn_play_hl', 'btn_play', 'btn_play_hl', 'btn_play');
    this.help = this.addButton(480, 380, 'sprites', this.doHelp, this, 'btn_quest_hl', 'btn_quest', 'btn_quest_hl', 'btn_quest');

    console.log('create is ready');
  },

  doStart: function() {
    this.scene.start('gamescene');
  },

  doLevel: function() {
    this.scene.start('levelmenu');
  },

  doControls: function() {
    this.scene.start('controlmenu');
  },

  doSettings: function() {
    this.scene.start('settingmenu');
  },

  doHelp: function() {
    this.scene.start('helpmenu');
  }

});

var LevelMenu = new Phaser.Class({

  Extends: Phaser.Scene,

  initialize:

    function MainMenu() {
      Phaser.Scene.call(this, {
        key: 'levelmenu'
      });
    },

  preload: function() {
    // map made with Tiled in JSON format
    this.load.image("tiles", "assets/tileset/custtiles1.png");
    this.load.tilemapTiledJSON('map', 'assets/tilemap/level1map.json');
  },

  create: function() {

    map = this.make.tilemap({
      key: 'map'
    });
    level = 1;
    diff = 1; //easy

    const tileset = map.addTilesetImage("custtiles1", "tiles");
    worldLayer = map.createDynamicLayer("BackLayer", tileset, 0, 0);

    // add tutorial and start button
    this.exit = this.addButton(400, 420, 'sprites', this.doReturn, this, 'btn_quest_hl', 'btn_quest', 'btn_quest_hl', 'btn_quest');
  },

  doReturn: function() {
    this.scene.start('mainmenu');
  }

});

var ControlsMenu = new Phaser.Class({

  Extends: Phaser.Scene,

  initialize:

    function MainMenu() {
      Phaser.Scene.call(this, {
        key: 'controlmenu'
      });
    },

    preload: function() {
      // map made with Tiled in JSON format
      this.load.image("tiles", "assets/tileset/custtiles1.png");
      this.load.tilemapTiledJSON('map', 'assets/tilemap/level1map.json');
    },

    create: function() {

      map = this.make.tilemap({
        key: 'map'
      });
      level = 1;
      diff = 1; //easy

      const tileset = map.addTilesetImage("custtiles1", "tiles");
      worldLayer = map.createDynamicLayer("BackLayer", tileset, 0, 0);

      // add tutorial and start button
      this.exit = this.addButton(400, 420, 'sprites', this.doReturn, this, 'btn_quest_hl', 'btn_quest', 'btn_quest_hl', 'btn_quest');
    },

    doReturn: function() {
      this.scene.start('mainmenu');
    }

});

var SettingsMenu = new Phaser.Class({

  Extends: Phaser.Scene,

  initialize:

    function MainMenu() {
      Phaser.Scene.call(this, {
        key: 'settingmenu'
      });
    },

    preload: function() {
      // map made with Tiled in JSON format
      this.load.image("tiles", "assets/tileset/custtiles1.png");
      this.load.tilemapTiledJSON('map', 'assets/tilemap/level1map.json');
    },

    create: function() {

      map = this.make.tilemap({
        key: 'map'
      });
      level = 1;
      diff = 1; //easy

      const tileset = map.addTilesetImage("custtiles1", "tiles");
      worldLayer = map.createDynamicLayer("BackLayer", tileset, 0, 0);

      // add tutorial and start button
      this.exit = this.addButton(400, 420, 'sprites', this.doReturn, this, 'btn_quest_hl', 'btn_quest', 'btn_quest_hl', 'btn_quest');
    },

    doReturn: function() {
      this.scene.start('mainmenu');
    }

});

var HelpMenu = new Phaser.Class({

  Extends: Phaser.Scene,

  initialize:

    function MainMenu() {
      Phaser.Scene.call(this, {
        key: 'helpmenu'
      });
    },

    preload: function() {
      // map made with Tiled in JSON format
      this.load.image("tiles", "assets/tileset/custtiles1.png");
      this.load.tilemapTiledJSON('map', 'assets/tilemap/level1map.json');
    },

    create: function() {

      map = this.make.tilemap({
        key: 'map'
      });
      level = 1;
      diff = 1; //easy

      const tileset = map.addTilesetImage("custtiles1", "tiles");
      worldLayer = map.createDynamicLayer("BackLayer", tileset, 0, 0);

      // add tutorial and start button
      this.exit = this.addButton(400, 420, 'sprites', this.doReturn, this, 'btn_quest_hl', 'btn_quest', 'btn_quest_hl', 'btn_quest');
    },

    doReturn: function() {
      this.scene.start('mainmenu');
    }

});
