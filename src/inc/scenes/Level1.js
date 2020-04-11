import Phaser from 'phaser';
/*
for (let asset of assets) {
    import asset from '../../'asset;
}
*/
import background_level_1 from '../../assets/background_level_1.png';
import spritesheet_dave_bobing from '../../assets/spritesheet_dave_bobbing.png';
import spritesheet_draws_idle_120x48_16 from '../../assets/spritesheet_draws_idle_120x48_16.png';
import spritesheet_draws_openempty_120x48_1 from '../../assets/spritesheet_draws_openempty_120x48_1.png';
import spritesheet_draws_opening_120x48_6 from '../../assets/spritesheet_draws_opening-120x48_6.png';

export default class Level1 extends Phaser.Scene {
    constructor() {
        super({key: 'Level1'});
        this.gameState = {test: 'test'};
    }
  
    preload() {
        this.load.image('bg', background_level_1);
        this.load.image('test', spritesheet_dave_bobing);
        this.load.spritesheet('sprite-sheet-dave-bobing', spritesheet_dave_bobing, { frameWidth: 32, frameHeight: 60 });
        this.load.spritesheet('spritesheet_draws_idle_120x48_16', spritesheet_draws_idle_120x48_16, { frameWidth: 120, frameHeight: 48 });
        this.load.spritesheet('spritesheet_draws_opening_120x48_6', spritesheet_draws_opening_120x48_6, { frameWidth: 120, frameHeight: 48 });
        this.load.spritesheet('spritesheet_draws_openempty_120x48_1', spritesheet_draws_openempty_120x48_1, { frameWidth: 120, frameHeight: 48 });
    }
  
    create() {
    //Variables
        var gameState = this.gameState;
        gameState.pickups = {
            notes : {
                drawernote: {
                    name: 'Note from Draw',
                    text: 'I O U a funny thing',
                    location: 'draw'
                }
            }
        }
        //gameState.hudText
    //Add Background
        this.add.image(338, 320, 'bg');
        console.log(this);
        
    //Add Dave
        gameState.dave = this.physics.add.sprite(400, 100, 'sprite-sheet-dave-bobing');
        gameState.dave.setCollideWorldBounds(true);
        gameState.dave.inventory = [];
        
    //Add Draws
        gameState.draws = this.physics.add.sprite(590, 86, 'spritesheet_draws_idle_120x48_16');
        gameState.draws.status = 'closed';
        gameState.draws.setImmovable(true);
        this.physics.add.collider(gameState.dave, gameState.draws, function() {
            if (gameState.draws.status === 'closed') {
                gameState.draws.anims.play('draws-opening-full', true);
                gameState.draws.status = 'opening';
                gameState.draws.on('animationcomplete', function() {
                    gameState.draws.status = 'open-full';
                });
            } else if ((gameState.draws.status === 'open-full')) {
                gameState.draws.status = 'open-empty';
                gameState.pickups.notes.drawernote.location = 'dave';
                gameState.draws.anims.play('draws-open-empty');
            }
        });
        console.log(gameState.draws);
        
    //Add Daves animations
        this.anims.create({
            key: 'dave-run',
            frames: this.anims.generateFrameNumbers('sprite-sheet-dave-bobing', { start: 0, end: 14 }),
            frameRate: 36,
            repeat: -1
        });
        this.anims.create({
            key: 'dave-idle',
            frames: this.anims.generateFrameNumbers('sprite-sheet-dave-bobing', { start: 0, end: 14 }),
            frameRate: 12,
            repeat: -1
        });
        
    //Draws animation
        this.anims.create({
            key: 'draws-idle',
            frames: this.anims.generateFrameNumbers('spritesheet_draws_idle_120x48_16', { start: 0, end: 15 }),
            frameRate: 24,
            repeat: -1,
            repeatDelay: 1000
        });
        this.anims.create({
            key: 'draws-opening-full',
            frames: this.anims.generateFrameNumbers('spritesheet_draws_opening_120x48_6', { start: 0, end: 5 }),
            frameRate: 12,
            repeat: 0,
        });
        this.anims.create({
            key: 'draws-open-empty',
            frames: this.anims.generateFrameNumbers('spritesheet_draws_openempty_120x48_1', { start: 0, end: 0 }),
            frameRate: 1,
            repeat: 0,
        });
        
        
    //Setup walls
        gameState.walls = this.physics.add.staticGroup();
        //Walls defined as x1, y1, x2, y2
        let wallGeometry = [{}];
        for (let wallGeo of wallGeometry) {
            let width = wallGeo.x2 - wallGeo.x1;
            let height = wallGeo.y2 - wallGeo.y1;
            let xCenter = wallGeo.x1 + (width/2);
            let yCenter = wallGeo.y1 + (height/2);
            gameState.walls.create(xCenter, yCenter, '').setSize(width, height);
        }
        gameState.walls.setVisible(false);
        this.physics.add.collider(gameState.dave, gameState.walls);
        
    //Enable keyboard
        gameState.cursors = this.input.keyboard.createCursorKeys();
        
    //Setup main camera
        this.cameras.main.setBounds(0, 0, 900, 600);
        this.cameras.main.startFollow(gameState.dave);
        
    //Debug x and y
        this.input.on('pointerup', function(pointer){
            console.log('X:' +  pointer.x + ' Y:' + pointer.y)
        });
        
    //Start idle animations
        gameState.dave.anims.play('dave-idle', true);
        gameState.draws.anims.play('draws-idle', true);
    }
  
    update() {
        var gameState = this.gameState;
    //Daves Movement
        if (gameState.cursors.right.isDown) {
            gameState.dave.setVelocityX(200);
            gameState.dave.flipX = false;
            gameState.dave.anims.play('dave-run', true);
        } else if (gameState.cursors.left.isDown) {
            gameState.dave.setVelocityX(-200);
            gameState.dave.flipX = true;
            gameState.dave.anims.play('dave-run', true);
        } else {
            gameState.dave.setVelocityX(0);
        }
        if (gameState.cursors.up.isDown) {
            gameState.dave.setVelocityY(-200);
            gameState.dave.anims.play('dave-run', true);
        } else if (gameState.cursors.down.isDown) {
              gameState.dave.setVelocityY(200);
              gameState.dave.anims.play('dave-run', true);
        } else {
              gameState.dave.setVelocityY(0);
            if (!gameState.cursors.left.isDown && !gameState.cursors.right.isDown) {
                  gameState.dave.anims.play('dave-idle', true);
            }
        }
    }
    
}