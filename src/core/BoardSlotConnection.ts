import * as Phaser from 'phaser';
import {Board} from './Board';
import {BoardSlot} from './BoardSlot';
import Line = Phaser.Geom.Line;

export class BoardSlotConnection {
  public readonly board: Board;
  public readonly slots: BoardSlot[];
  public readonly shape: Line;

  constructor(board: Board, slots: BoardSlot[]) {
    this.board = board;
    this.slots = slots;
    this.shape = new Line(this.slots[0].x, this.slots[0].y, this.slots[1].x, this.slots[1].y);
    this.board.connections.push(this);
  }

  hasConnectionTo(id: string) {
    return !!this.slots.find(slot => slot.id === id);
  }

  getConnectedSlot(origin: BoardSlot) {
    if (this.slots.find(slot => slot.id === origin.id)) {
      return this.slots.find(slot => slot.id !== origin.id);
    }
    throw new Error('Provided Slot not part of the connection');
  }
}
