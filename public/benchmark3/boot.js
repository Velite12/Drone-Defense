

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
    this.load.atlas('buttons', 'assets/sprites/buttons/buttons.png', 'assets/sprites/buttons/buttons.json');
    },

    create: function ()
    {
		this.scene.start('preloader');
    }
});
