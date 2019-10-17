import {Board} from '../core/Board';
import {HalmaColor as GameColor} from '../util/HalmaColor';
import {Player} from '../core/Player';
import {StatusText} from '../objects/StatusText';
import {GameButton} from '../objects/GameButton';
import {GameMenu} from '../objects/GameMenu';

export class MenuScene extends Phaser.Scene {


  constructor() {
    super({
      key: 'MenuScene',
    });
  }

  init(): void {

  }

  create(): void {
    const text = this.add.text(0,100, 'Halma Online');
    text.setAlign('center');
    text.setFixedSize(Number(this.game.config.width), 100);

    const menu = new GameMenu(this, 200);
  }

  update(time): void {
  }
}
