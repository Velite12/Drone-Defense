// Phaser3 example game
// preloader and loading bar

var Preloader = new Phaser.Class({

	Extends: Phaser.Scene,

	initialize:

	function Preloader()
	{
		// note: the pack:{files[]} acts like a pre-preloader
		// this eliminates the need for an extra "boot" scene just to preload the loadingbar images
		Phaser.Scene.call(this, {
			key: 'preloader'
		});
	},

	setPreloadSprite: function (sprite)
	{
		this.preloadSprite = { sprite: sprite, width: sprite.width, height: sprite.height };

		//sprite.crop(this.preloadSprite.rect);
		sprite.visible = true;

		// set callback for loading progress updates
		this.load.on('progress', this.onProgress, this );
		this.load.on('fileprogress', this.onFileProgress, this );
	},

	onProgress: function (value) {

		if (this.preloadSprite)
		{
			// calculate width based on value=0.0 .. 1.0
			var w = Math.floor(this.preloadSprite.width * value);

			// set width of sprite
			this.preloadSprite.sprite.frame.width    = w;
			this.preloadSprite.sprite.frame.cutWidth = w;

			// update screen
			this.preloadSprite.sprite.frame.updateUVs();
		}
	},

	onFileProgress: function (file) {
		// debugger;
		// assetText.setText('onFileProgress: file.key=' + file.key);
	},

	preload: function ()
	{
		// setup the loading bar
		// note: images are available during preload because of the pack-property in the constructor
		this.loadingbar_bg   = this.add.sprite(400, 300, "loadingbar_bg");
		this.loadingbar_fill = this.add.sprite(400, 300, "loadingbar_fill");
		this.setPreloadSprite(this.loadingbar_fill);

		// !! TESTING !! load the same image 500 times just to slow down the load and test the loading bar
		for (var i = 0; i < 500; i++) {
			this.load.image('testloading'+i, '../assets/tileset/custtiles1.png');
		};
		// !! TESTING !!
	},

	create: function() {

		console.log('Preloader scene is ready, now start the actual game and never return to this scene');

		// dispose loader bar images
		this.loadingbar_bg.destroy();
		this.loadingbar_fill.destroy();
		this.preloadSprite = null;

		if(window.location.hash){
		// start actual game
		console.log()
		if(this.scene.getIndex(window.location.hash.slice(1)) != -1){
			this.scene.start(''+window.location.hash.slice(1)+'');
		}else{
			this.scene.start('mainmenu');
		}
	}else{
		this.scene.start('mainmenu');
	}

	}
});
