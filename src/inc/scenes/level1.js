import 'phaser';
/*global Phaser*/

export default class Level1 extends Phaser.Scene {
    constructor() {
        super({key: 'level1'});
        console.log('Running level1');
        this.localSys = {};
    }

    preload() {
        let images = [
            {name: 'bg', file: 'background_675x640.png'},
            {name: 'knifeStuck', file: 'knife_stuck_29x8.png'}
            ];
        for (let image of images) {
            this.load.image(image.name, 'assets/level1/image/'+image.file);
        }

        let spritesheets = [
            {name: 'dave_bobing_25x52_15', file: 'dave_bobbing_25x52_15.png', width: 25, height: 52},
            {name: 'draws_idle_120x48_16', file: 'draws_idle_120x48_16.png', width: 120, height: 48},
            {name: 'draws_opening_120x48_6', file: 'draws_opening_120x48_6.png', width: 120, height: 48},
            {name: 'draws_open_empty_120x48_1', file: 'draws_open_empty_120x48_1.png', width: 120, height: 48},
            {name: 'knife_rotating_44x44_4', file: 'knife_rotating_44x44_4.png', width: 44, height: 44},
            {name: 'knife_idle_44x8_7', file: 'knife_idle_44x8_7.png', width: 44, height: 8},
            ];
        for (let spritesheet of spritesheets) {
            this.load.spritesheet(spritesheet.name, 'assets/level1/spritesheet/'+spritesheet.file, {frameWidth: spritesheet.width, frameHeight: spritesheet.height});
        }
    }

    create() {
    //Variables
        var localSys = this.localSys;
        localSys.pickups = {};

    //Add Background
        this.add.image(338, 320, 'bg');
    //Add Dave
        localSys.dave = this.physics.add.sprite(400, 100, 'dave_bobing_25x52_15');
        localSys.dave.setCollideWorldBounds(true);
        localSys.dave.setAlpha(0.7);
        //localSys.dave.setSize(25, 10, false);
        //localSys.dave.setOffset(0, 42);
        localSys.dave.faceingRight = true;
        localSys.dave.inventory = {};

        this.anims.create({
            key: 'dave-run',
            frames: this.anims.generateFrameNumbers('dave_bobing_25x52_15', { start: 0, end: 14 }),
            frameRate: 36,
            repeat: -1
        });
        this.anims.create({
            key: 'dave-idle',
            frames: this.anims.generateFrameNumbers('dave_bobing_25x52_15', { start: 0, end: 14 }),
            frameRate: 12,
            repeat: -1
        });

    //Add Draws
        localSys.draws = this.physics.add.sprite(450, 250, 'draws_idle_120x48_16');
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
            frames: this.anims.generateFrameNumbers('draws_idle_120x48_16', { start: 0, end: 15 }),
            frameRate: 24,
            repeat: -1,
            repeatDelay: 1000
        });
        this.anims.create({
            key: 'draws-opening-full',
            frames: this.anims.generateFrameNumbers('draws_opening_120x48_6', { start: 0, end: 5 }),
            frameRate: 12,
            repeat: 0
        });
        this.anims.create({
            key: 'draws-open-empty',
            frames: this.anims.generateFrameNumbers('draws_open_empty_120x48_1', { start: 0, end: 0 }),
            frameRate: 1,
            repeat: 0
        });


    //Add Knife
        localSys.pickups.knife =  this.physics.add.sprite(100, 200, 'knife_idle_44x8_7');
        this.physics.add.collider(this.localSys.dave, this.localSys.pickups.knife, this.pickupKnife, null, this);
        localSys.pickups.knife.isPickupable = true;
        localSys.dave.inventory.knife = false;
        this.anims.create({
            key: 'knife-idle',
            frames: this.anims.generateFrameNumbers('knife_idle_44x8_7', { start: 0, end: 6 }),
            frameRate: 12,
            repeat: -1,
            repeatDelay: 1000
        });
        localSys.pickups.knife.anims.play('knife-idle', true);

    //Setup walls
        let outerWalls = [
            {x: 0, y: 0, w: 1, h: 640},
            {x: 0, y: 0, w: 675, h: 1},
            {x: 674, y: 0, w: 1, h: 640},
            {x: 0, y: 639, w: 675, h: 1}
            ];
        this.localSys.walls = {};
        this.localSys.walls.outerwalls = this.drawWalls(outerWalls);

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

    throwKnife() {
        //TODO 1) Tidy up passed variables for localSys
        //TODO 2) Check for knife being spawned in object
        if (this.localSys.dave.inventory.knife) {
            //Spawn knife Old offset 35
            var offset = 1;
            var directionMultiplier = 1;
            if (!this.localSys.dave.faceingRight) {
                directionMultiplier = -1;
                offset = -1;
            }
            this.localSys.dave.knife = this.physics.add.sprite((this.localSys.dave.x + offset), this.localSys.dave.y, 'knife_rotating_44x44_4');
            this.localSys.dave.knife.setVelocityX(400 * directionMultiplier);
            if (this.localSys.dave.body.velocity.y > 0) {
                this.localSys.dave.knife.setVelocityY(400);
            } else if (this.localSys.dave.body.velocity.y < 0) {
                this.localSys.dave.knife.setVelocityY(-400);
            }
            this.localSys.dave.knife.setCollideWorldBounds(true);
            this.localSys.dave.knife.faceingRight = this.localSys.dave.faceingRight;

            this.anims.create({
                key: 'knife-throw',
                frames: this.anims.generateFrameNumbers('knife_rotating_44x44_4', { start: 0, end: 3 }),
                frameRate: 12,
                repeat: -1
            });

            this.localSys.dave.knife.anims.play('knife-throw', true);
            if (this.localSys.dave.faceingRight) {
                 this.localSys.dave.knife.flipX = true;
            }

            //this.physics.add.collider(this.localSys.dave, this.localSys.dave.knife, this.pickupKnife, null, this);
            this.physics.add.collider(this.localSys.draws, this.localSys.dave.knife, this.knifeHitsObject, null, this);
            this.physics.add.collider(this.localSys.walls.outerwalls, this.localSys.dave.knife, this.knifeHitsObject, null, this);

            this.localSys.dave.inventory.knife = false;
            this.localSys.pickups.knife.isPickupable = false;
        }
    }


    knifeHitsObject(object) {
        this.physics.pause();

        var currentKnife = {
            x: this.localSys.dave.knife.x,
            y: this.localSys.dave.knife.y,
            height: this.localSys.dave.knife.height,
            width: this.localSys.dave.knife.width,
            faceingRight: this.localSys.dave.knife.faceingRight,
            edge: {
                top: (this.localSys.dave.knife.y-(this.localSys.dave.knife.height/2)),
                bottom: (this.localSys.dave.knife.y+(this.localSys.dave.knife.height/2)),
                left: (this.localSys.dave.knife.x-(this.localSys.dave.knife.width/2)),
                right: (this.localSys.dave.knife.x+(this.localSys.dave.knife.wodth/2))
            }
        };
        var currentObject = {
            x: object.x,
            y: object.y,
            edge: {
                top: (object.y-(object.height/2)),
                bottom: (object.y+(object.height/2)),
                left: (object.x-(object.width/2)),
                right: (object.x+(object.wodth/2))
            }
        }
        var newKnife = currentKnife;
        this.localSys.dave.knife.destroy();

        //Move knife to clostes edge

        //Check orientation and align

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

        this.physics.resume();
    }


    drawWalls(wallsArray) {
        const walls = this.physics.add.staticGroup();
        //Walls defined as x, y, w, h from top right corner
        for (let wall of wallsArray) {
            let wallX = wall.x + (wall.w / 2);
            let wallY = wall.y + (wall.h / 2);
            walls.create(wallX, wallY, '').setSize(wall.w, wall.h);
        }
        walls.setVisible(false);
        return walls;
    }

    interactWithMirror(MirrorID) {

    }
}
