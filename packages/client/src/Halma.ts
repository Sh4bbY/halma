import * as Phaser from 'phaser';
import {GameScene, MenuScene} from './scenes';
import {LobbyScene} from './scenes/LobbyScene';

const config = {
  type           : Phaser.AUTO,
  parent         : 'game',
  width          : 800,
  height         : 800,
  zoom           : 1,
  title          : 'Halma Online',
  scene          : [MenuScene, LobbyScene, GameScene],
  backgroundColor: '#000000',
  dom: {
    createContainer: true
  },
};

export class Halma extends Phaser.Game {

  public socket: any;

  constructor() {
    super(config);
  }
}
