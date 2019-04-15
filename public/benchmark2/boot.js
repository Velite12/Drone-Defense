

var Boot = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Boot ()
    {
        Phaser.Scene.call(this, { key: 'boot' });
    },

    preload: function ()
    {
		this.load.image('loadingbar_bg', 'assets/sprites/preloader/loadingbar_bg.png');
		this.load.image('loadingbar_fill', 'assets/sprites/preloader/loadingbar_fill.png');
    },

    create: function ()
    {
		this.scene.start('preloader');
    }
});
