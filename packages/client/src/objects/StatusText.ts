import {Player} from '../core/Player';
import Scene = Phaser.Scene;

export class StatusText extends Phaser.GameObjects.Text {

  constructor(scene: Scene, player: Player) {
    const style: any = {font: 'bold 32px Arial', fill: player.colorString};
    super(scene, 0, 5, `${player.name} beginnt!`, style);

    this.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
    this.setAlign('center');
    this.setFixedSize(800, 100);
  }

  public setPlayer(player: Player) {
    this.setColor(player.colorString);
    this.setText(`${player.name} ist dran!`);
  }
}
