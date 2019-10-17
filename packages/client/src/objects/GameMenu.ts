import Scene = Phaser.Scene;
import {GameButton} from './GameButton';

export class GameMenu {
  private scene: Phaser.Scene;
  private y: number;

  constructor(scene: Scene, y: number) {
    this.scene = scene;
    this.y     = y;

    const items = [
      {
        text: 'Play Online', action: () => {
          this.scene.game.scene.stop('MenuScene');
          this.scene.game.scene.start('LobbyScene');
        },
      },
      {
        text: 'Play Local', action: () => {
          this.scene.game.scene.stop('MenuScene');
          this.scene.game.scene.start('GameScene');
        },
      },
      {
        text: 'Options', action: () => {
        },
      },
    ];

    this.createButtons(items);
  }

  public createButtons(items: any[]) {
    items.forEach((item, i) => {
      const btn = new GameButton(this.scene, item.text, this.y + i * 50, item.action);
      this.scene.add.existing(btn);
    });
  }
}
