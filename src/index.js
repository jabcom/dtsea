import Phaser from 'phaser';
import level1 from './inc/scenes/level1.js';
import mirror from './inc/scenes/mirror.js';
import globalSys from './inc/globalSys.js';

const config = {
    type: Phaser.AUTO,
    parent: null,
    width: 675,
    height: 640,
    physics: {
        default: 'arcade',
        arcade: {
            enableBody: true,
            allowGravity: false,
            debug: false
        }
    }
};

class Game extends Phaser.Game {
  constructor () {
    super(config);
    this.globalSys = new(globalSys);
    this.scene.add('level1', level1);
    this.scene.add('mirror', mirror);
    this.scene.start('level1');
  }
}

const game = new Game(config);