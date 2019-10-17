import Scene = Phaser.Scene;

export class GameButton extends Phaser.GameObjects.Text {

  constructor(scene: Scene, text: string, y: number, action: () => {}) {
    const style: any = {font: 'bold 32px Arial', fill: '#FFF'};
    super(scene, 0, y, text, style);

    this.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
    this.setAlign('center');
    this.setFixedSize(Number(this.scene.game.config.width), 30);
    this.setInteractive();
    this.on('pointerdown', action);

    scene.input.on('gameobjectover', (pointer, gameObject) => gameObject.setColor('#F00'));
    scene.input.on('gameobjectout', (pointer, gameObject) => gameObject.setColor('#FFF'));
  }
}
