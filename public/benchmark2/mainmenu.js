var textStyle = {
    font: "normal 14px Arial",
    fill: '#ffffff',
    align: 'left',
    wordWrap:{
      width: 300, useAdvancedWrap: true
    }
};

var headerStyle = {
    font: "normal 18px Arial",
    fill: '#ffffff',
    align: 'center',
    wordWrap:{
      width: 300, useAdvancedWrap: true
    }
};

var titleStyle = {
    font: "normal 24px Arial",
    fill: '#ffffff',
    align: 'center',
    wordWrap:{
      width: 300, useAdvancedWrap: true
    }
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
    this.newgame = this.addButton(400, 260, 'buttons', this.doStart, this, 'newGameButtonHover', 'newGameButton', 'newGameButtonHover', 'newGameButton');
    this.levelsel = this.addButton(320, 320, 'buttons', this.doLevel, this, 'levelSelectButtonHover', 'levelSelectButton', 'levelSelectButtonHover', 'levelSelectButton');
    this.controls = this.addButton(320, 380, 'buttons', this.doControls, this, 'controlsButtonHover', 'controlsButton', 'controlsButtonHover', 'controlsButton');
    this.settings = this.addButton(480, 320, 'buttons', this.doSettings, this, 'settingsButtonHover', 'settingsButton', 'settingsButtonHover', 'settingsButton');
    this.help = this.addButton(480, 380, 'buttons', this.doHelp, this, 'helpButtonHover', 'helpButton', 'helpButtonHover', 'helpButton');
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
    this.exit = this.addButton(400, 420, 'buttons', this.doReturn, this, 'returnButtonHover', 'returnButton', 'returnButtonHover', 'returnButton');

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

    var controls = [
      "Move Left = Left key",
      "",
      "Move Right = Right key",
      "",
      "Aiming = Mouse",
      "",
      "Shoot = Left Click",
      "",
      "Weapon swap = Right Click"
    ]

    this.add.text(275,200,controls,headerStyle);

    // add tutorial and start button
    this.exit = this.addButton(400, 420, 'buttons', this.doReturn, this, 'returnButtonHover', 'returnButton', 'returnButtonHover', 'returnButton');
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
    this.exit = this.addButton(400, 420, 'buttons', this.doReturn, this, 'returnButtonHover', 'returnButton', 'returnButtonHover', 'returnButton');
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

    var madeBy = "Immanuel Almosara, Sebastian Chamorro, Rahul Sondhi"

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

    this.add.text(275,210,"Game Designed By",headerStyle);
    this.add.text(275,230,madeBy,textStyle);
    this.add.text(50,270,"Story",headerStyle);
    this.add.text(50,290,story,textStyle);
    this.add.text(500,270,"Characters",headerStyle);
    this.add.text(500,290,story,textStyle);

    // add tutorial and start button
    this.exit = this.addButton(400, 420, 'buttons', this.doReturn, this, 'returnButtonHover', 'returnButton', 'returnButtonHover', 'returnButton');
  },

  doReturn: function() {
    this.scene.start('mainmenu');
  }

});
