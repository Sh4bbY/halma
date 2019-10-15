import * as Phaser from 'phaser';
import {GameScene} from './scenes/GameScene';

const config = {
  type           : Phaser.AUTO,
  parent         : 'canvas',
  width          : 800,
  height         : 800,
  scene          : [GameScene],
  backgroundColor: '#000000',
};

export class Halma extends Phaser.Game {
  constructor() {
    super(config);
  }
}
