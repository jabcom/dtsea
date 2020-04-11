import Phaser from 'phaser';
import Level1 from './inc/scenes/Level1.js';

const config = {
    type: Phaser.AUTO,
    parent: 'phaser',
    width: 675,
    height: 640,
    scene: [Level1],
    physics: {
        default: 'arcade',
        arcade: {
            enableBody: true,
            allowGravity: false,
            debug: true
        }
    }
};

const game = new Phaser.Game(config);