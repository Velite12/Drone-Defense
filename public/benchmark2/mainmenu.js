var textStyle = {
    font: "normal 20px Arial",
    fill: '#ffffff',
    align: 'center',
    boundsAlignH: "center", // bounds center align horizontally
    boundsAlignV: "middle" // bounds center align vertically
};

var headerStyle = {
    font: "normal 30px Arial",
    fill: '#ffffff',
    align: 'center',
    boundsAlignH: "center", // bounds center align horizontally
    boundsAlignV: "middle" // bounds center align vertically
};

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
    window.location.hash = "mainmenu";
    this.load.image("tiles", "assets/tileset/custtiles1.png");
    this.load.image("logo", "assets/branding/logo.png");
    this.load.tilemapTiledJSON('map', 'assets/tilemap/level1map.json');
  },

  create: function() {

    map = this.make.tilemap({
      key: 'map'
    });

    const tileset = map.addTilesetImage("custtiles1", "tiles");
    worldLayer = map.createDynamicLayer("BackLayer", tileset, 0, 0);

    var logo = this.add.sprite(400, 140, 'logo');
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
    window.location.hash = "levelmenu";
    this.load.image("tiles", "assets/tileset/custtiles1.png");
    this.load.image("logo", "assets/branding/logo.png");
    this.load.tilemapTiledJSON('map', 'assets/tilemap/level1map.json');
  },

  create: function() {

    map = this.make.tilemap({
      key: 'map'
    });

    const tileset = map.addTilesetImage("custtiles1", "tiles");
    worldLayer = map.createDynamicLayer("BackLayer", tileset, 0, 0);
    var logo = this.add.sprite(400, 140, 'logo');

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
    window.location.hash = "controlmenu";
    this.load.image("tiles", "assets/tileset/custtiles1.png");
    this.load.image("logo", "assets/branding/logo.png");
    this.load.tilemapTiledJSON('map', 'assets/tilemap/level1map.json');
  },

  create: function() {

    map = this.make.tilemap({
      key: 'map'
    });

    const tileset = map.addTilesetImage("custtiles1", "tiles");
    worldLayer = map.createDynamicLayer("BackLayer", tileset, 0, 0);
    var logo = this.add.sprite(400, 140, 'logo');

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
    window.location.hash = "settingmenu";
    this.load.image("tiles", "assets/tileset/custtiles1.png");
    this.load.image("logo", "assets/branding/logo.png");
    this.load.tilemapTiledJSON('map', 'assets/tilemap/level1map.json');
  },

  create: function() {

    map = this.make.tilemap({
      key: 'map'
    });

    const tileset = map.addTilesetImage("custtiles1", "tiles");
    worldLayer = map.createDynamicLayer("BackLayer", tileset, 0, 0);
    var logo = this.add.sprite(400, 140, 'logo');

    // add tutorial and start button
    this.exit = this.addButton(400, 420, 'sprites', this.doReturn, this, 'btn_quest_hl', 'btn_quest', 'btn_quest_hl', 'btn_quest');
  },

  doReturn: function() {
    this.scene.start('mainmenu');
  }

});


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
    window.location.hash = "helpmenu";
    this.load.image("tiles", "assets/tileset/custtiles1.png");
    this.load.image("logo", "assets/branding/logo.png");
    this.load.tilemapTiledJSON('map', 'assets/tilemap/level1map.json');
  },

  create: function() {

    map = this.make.tilemap({
      key: 'map'
    });

    const tileset = map.addTilesetImage("custtiles1", "tiles");
    worldLayer = map.createDynamicLayer("BackLayer", tileset, 0, 0);
    var logo = this.add.sprite(400, 140, 'logo');

    var background = [
      "Game Developed By:",
      "Immanuel Almosara, Sebastian Chamorro, Rahul Sondhi"
    ]

    var story = "Return to Sender is a game where our main character fights his way through all of the delivery drones that are hovering over his house. The delivery drones are sent by the well renowned company Amazon who felt they could be more efficent by automating their delivries as opposed to hiring workers. Our main character feels threatened by these machines and decides to shoot as many of them down as possible, and stealing all of the mail going to his neighbors."

    var characters = [
      "Amazon is a shipping company who thrives to be the largest shipping company on the market.",
      "",
      "The drones are machines created by amazon made in order to make delivery much easier and cheaper for the companies' overall business.",
      "",
      "The neighbors are the people who order the packages from amazon and are very upset that our character's delaying their delivery.",
      "",
      "The main character is a southern gun-loving obese male who isn't too familiar with advanced technology and firmly believes the world is better without it."
    ]

    // add tutorial and start button
    this.exit = this.addButton(400, 420, 'sprites', this.doReturn, this, 'btn_quest_hl', 'btn_quest', 'btn_quest_hl', 'btn_quest');
  },

  doReturn: function() {
    this.scene.start('mainmenu');
  }

});
