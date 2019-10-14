import * as Phaser from 'phaser';
import {Board} from './Board';
import {BoardSlotConnection} from './BoardSlotConnection';
import Circle = Phaser.Geom.Circle;

export class BoardSlot {
  private readonly board: Board;
  public readonly id: string;
  private static readonly radius = 10;
  public connections: BoardSlotConnection[] = [];
  public shape: Circle;

  constructor(board, x, y) {
    this.board = board;
    this.id = BoardSlot.getId(x, y);
    this.shape = new Circle(x, y, BoardSlot.radius);
    this.board.slots.push(this);
  }

  public getDistanceTo(slot: BoardSlot): number {
    return Math.sqrt(Math.pow(slot.x - this.x, 2) + Math.pow(slot.y - this.y, 2));
  }

  public hasConnectionTo(id: string): boolean {
    return this.connections.reduce((accumulator, conn) => accumulator || conn.hasConnectionTo(id), false);
  }

  public getConnectedSlots(): BoardSlot[] {
    return this.connections.map(conn => conn.getConnectedSlot(this));
  }

  static getId(x, y) {
    return `${Math.round(x)}-${Math.round(y)}`;
  }

  get x() {
    return this.shape.x;
  }

  get y() {
    return this.shape.y;
  }
}
