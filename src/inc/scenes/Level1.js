import 'phaser';
/*global Phaser*/

export default class Level1 extends Phaser.Scene {
    constructor() {
        super({key: 'Level1'});
        console.log('Running Level1');
        this.localSys = {};
    }
  
    preload() {
        this.load.image('bg', 'assets/background_level_1.png');
        this.load.image('knifeStuck', 'assets/spritesheet_draws_knife_stuck_29x8.png');
        this.load.spritesheet('sprite-sheet-dave-bobing', 'assets/spritesheet_dave_bobbing_25x52_15.png', { frameWidth: 25, frameHeight: 52 });
        this.load.spritesheet('spritesheet_draws_idle_120x48_16', 'assets/spritesheet_draws_idle_120x48_16.png', { frameWidth: 120, frameHeight: 48 });
        this.load.spritesheet('spritesheet_draws_opening_120x48_6', 'assets/spritesheet_draws_opening-120x48_6.png', { frameWidth: 120, frameHeight: 48 });
        this.load.spritesheet('spritesheet_draws_openempty_120x48_1', 'assets/spritesheet_draws_openempty_120x48_1.png', { frameWidth: 120, frameHeight: 48 });
        this.load.spritesheet('spritesheet_draws_rotating_knife_44x44_4', 'assets/spritesheet_draws_rotating_knife_44x44_4.png', { frameWidth: 44, frameHeight: 44 });
        this.load.spritesheet('spritesheet_draws_idle_knife_44x8_7', 'assets/spritesheet_draws_idle_knife_44x8_7.png', { frameWidth: 44, frameHeight: 8 });
    }
  
    create() {
        this.testMethod();
    //Variables
        var localSys = this.localSys;
        localSys.pickups = {};
        
    //Add Background
        this.add.image(338, 320, 'bg');
    //Add Dave
        localSys.dave = this.physics.add.sprite(400, 100, 'sprite-sheet-dave-bobing');
        localSys.dave.setCollideWorldBounds(true);
        localSys.dave.setAlpha(0.7);
        //localSys.dave.setSize(25, 10, false);
        //localSys.dave.setOffset(0, 42);
        localSys.dave.faceingRight = true;
        localSys.dave.inventory = {};
        
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
        
    //Add Draws
        localSys.draws = this.physics.add.sprite(590, 86, 'spritesheet_draws_idle_120x48_16');
        localSys.draws.status = 'closed';
        localSys.draws.setImmovable(true);
        this.physics.add.collider(localSys.dave, localSys.draws, function() {
            if (localSys.draws.status === 'closed') {
                localSys.draws.anims.play('draws-opening-full', true);
                localSys.draws.status = 'opening';
                localSys.draws.on('animationcomplete', function() {
                    localSys.draws.status = 'open-full';
                });
            } else if ((localSys.draws.status === 'open-full')) {
                localSys.draws.status = 'open-empty';
                //localSys.pickups.notes.drawernote.location = 'dave';
                localSys.draws.anims.play('draws-open-empty');
            }
        });
        
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
            repeat: 0
        });
        this.anims.create({
            key: 'draws-open-empty',
            frames: this.anims.generateFrameNumbers('spritesheet_draws_openempty_120x48_1', { start: 0, end: 0 }),
            frameRate: 1,
            repeat: 0
        });
        
        
    //Add Knife
        localSys.pickups.knife =  this.physics.add.sprite(100, 200, 'spritesheet_draws_idle_knife_44x8_7');
        this.physics.add.collider(this.localSys.dave, this.localSys.pickups.knife, this.pickupKnife, null, this);
        localSys.pickups.knife.isPickupable = true;
        localSys.dave.inventory.knife = false;
        this.anims.create({
            key: 'knife-idle',
            frames: this.anims.generateFrameNumbers('spritesheet_draws_idle_knife_44x8_7', { start: 0, end: 6 }),
            frameRate: 12,
            repeat: -1,
            repeatDelay: 1000
        });
        localSys.pickups.knife.anims.play('knife-idle', true);
        
    //Setup walls
        localSys.walls = this.physics.add.staticGroup();
        //Walls defined as x1, y1, x2, y2
        let wallGeometry = [{}];
        for (let wallGeo of wallGeometry) {
            let width = wallGeo.x2 - wallGeo.x1;
            let height = wallGeo.y2 - wallGeo.y1;
            let xCenter = wallGeo.x1 + (width/2);
            let yCenter = wallGeo.y1 + (height/2);
            localSys.walls.create(xCenter, yCenter, '').setSize(width, height);
        }
        localSys.walls.setVisible(false);
        this.physics.add.collider(localSys.dave, localSys.walls);
        
    //Enable keyboard
        localSys.cursors = this.input.keyboard.createCursorKeys();
        
    //Setup main camera
        this.cameras.main.setBounds(0, 0, 900, 600);
        this.cameras.main.startFollow(localSys.dave);
        
        
    //Start idle animations
        localSys.dave.anims.play('dave-idle', true);
        localSys.draws.anims.play('draws-idle', true);
    }
  
    update() {
        var localSys = this.localSys;
    //Daves Movement
        if (localSys.cursors.right.isDown) {
            localSys.dave.setVelocityX(200);
            localSys.dave.flipX = false;
            localSys.dave.faceingRight = true;
            localSys.dave.anims.play('dave-run', true);
        } else if (localSys.cursors.left.isDown) {
            localSys.dave.setVelocityX(-200);
            localSys.dave.flipX = true;
            localSys.dave.faceingRight = false;
            localSys.dave.anims.play('dave-run', true);
        } else {
            localSys.dave.setVelocityX(0);
        }
        if (localSys.cursors.up.isDown) {
            localSys.dave.setVelocityY(-200);
            localSys.dave.anims.play('dave-run', true);
        } else if (localSys.cursors.down.isDown) {
              localSys.dave.setVelocityY(200);
              localSys.dave.anims.play('dave-run', true);
        } else {
              localSys.dave.setVelocityY(0);
            if (!localSys.cursors.left.isDown && !localSys.cursors.right.isDown) {
                  localSys.dave.anims.play('dave-idle', true);
            }
        }
        
    //Daves fire
        if (localSys.cursors.space.isDown) {
            this.throwKnife(localSys.dave);
        }
        
    }
    
    pickupKnife(dave, knife) {
        if (this.localSys.pickups.knife.isPickupable || true) {
            knife.destroy();
            this.localSys.dave.inventory.knife = true;
            this.localSys.pickups.knife.isPickupable = false;
        }
    }
    
    throwKnife(dave) {
        if (dave.inventory.knife) {
            //Spawn knife
            var offset = 1;
            if (!dave.faceingRight) {
                offset = -1;
            }
            dave.knife = this.physics.add.sprite((dave.x + (offset * ((dave.width / 2)+1))), dave.y, 'spritesheet_draws_rotating_knife_44x44_4');
            dave.knife.setVelocityX(400 * offset);
            dave.knife.setCollideWorldBounds(true);
            dave.knife.faceingRight = dave.faceingRight;
            
            this.anims.create({
                key: 'knife-throw',
                frames: this.anims.generateFrameNumbers('spritesheet_draws_rotating_knife_44x44_4', { start: 0, end: 3 }),
                frameRate: 12,
                repeat: -1
            });
            
            dave.knife.anims.play('knife-throw', true);
            if (dave.faceingRight) {
                 dave.knife.flipX = true;
            }

            this.physics.add.collider(this.localSys.dave, this.localSys.pickups.knife, this.pickupKnife, null, this);

            dave.inventory.knife = false;
            this.localSys.pickups.knife.isPickupable = false;
        }
    }
    
    
    knifeHitsObject(knife) {
        var currentKnife = {
            x: knife.x,
            y: knife.y,
            faceingRight: knife.faceingRight
        };
        knife.destroy();
        var offset = -15;
        if (currentKnife.faceingRight) {
            offset = offset * -1;
        }
        this.localSys.pickups.knife =  this.physics.add.sprite((currentKnife.x + offset), currentKnife.y, 'knifeStuck');
        if (currentKnife.faceingRight) {
            this.localSys.pickups.knife.flipX = true;
        }
        
        this.physics.add.collider(this.localSys.dave, this.localSys.pickups.knife, this.pickupKnife, null, this);
        this.localSys.pickups.knife.isPickupable = true;
    }
    
    testMethod() {
        console.log('Test Method');
    }
}