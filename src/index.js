import Phaser from 'phaser';
import Level1 from './inc/scenes/Level1.js';
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
            debug: true
        }
    }
};

class Game extends Phaser.Game {
  constructor () {
    super(config);
    this.globalSys = new(globalSys);
    this.scene.add('Level1', Level1);
    this.scene.start('Level1');
  }
}

const game = new Game(config);