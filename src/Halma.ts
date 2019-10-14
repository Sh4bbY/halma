import * as Phaser from 'phaser';
import {Game} from 'phaser';
import {Board} from './core/Board';
import {Player} from './core/Player';

export class Halma {
  private board: Board;
  private players: Player[];
  private game: Game;

  constructor() {
    this.board = new Board();
    const slots = this.board.slots;
    const connections = this.board.connections;

    this.game = new Game({
      type: Phaser.AUTO,
      width: this.board.width,
      height: this.board.height,
      scene: {
        create() {
          const graphics = this.add.graphics({lineStyle: {width: 1, color: 0xFFFFFF}, fillStyle: {color: 0xFFFFFF}});

          slots.forEach(slot => {
            graphics.strokeCircleShape(slot.shape);
            graphics.fillCircleShape(slot.shape);
            // console.log(slot.connections.length);
          });

          connections.forEach(connection => {
            graphics.strokeLineShape(connection.shape);
          });
        },
      },
    });
  }
}
