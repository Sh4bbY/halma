import {Board} from '../core/Board';
import {HalmaColor as GameColor} from '../util/HalmaColor';
import {Player} from '../core/Player';
import {StatusText} from '../objects/StatusText';

export class GameScene extends Phaser.Scene {
  private board: Board;
  private statusText: StatusText;
  private players: Player[];
  private playerCount: number = 0;
  public currentPlayer: Player;

  constructor() {
    super({
      key: 'GameScene',
    });
  }

  init(): void {
    this.players = [
      new Player('Player 1', GameColor.RED, '#F00'),
      new Player('Player 2', GameColor.BLUE, '#00F'),
      new Player('Player 3', GameColor.GREEN, '#0F0'),
    ];
    this.board   = new Board(this, this.players, true);

    this.board.connections.forEach(connection => this.add.existing(connection));
    this.board.slots.forEach(slot => this.add.existing(slot));
    this.board.pins.forEach(pin => this.add.existing(pin));


    this.currentPlayer = this.players[this.playerCount];
    this.statusText   = new StatusText(this, this.currentPlayer);
    this.add.existing(this.statusText);

  }

  create(): void {


    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      if (this.currentPlayer.color !== gameObject.player.color) {
        return;
      }
      gameObject.x = dragX;
      gameObject.y = dragY;
    });


    this.input.on('gameobjectover', (pointer, gameObject) => {
      if (this.currentPlayer.color !== gameObject.player.color) {
        return;
      }
      gameObject.lineWidth = 2;
      gameObject.render();
    });

    this.input.on('gameobjectout', (pointer, gameObject) => {
      if (this.currentPlayer.color !== gameObject.player.color) {
        return;
      }
      gameObject.lineWidth = 0;
      gameObject.render();
    });
  }

  update(time): void {
  }

  movedPin(): void {
    this.currentPlayer = this.players[++this.playerCount % this.players.length];
    this.statusText.setPlayer(this.currentPlayer);
  }
}
