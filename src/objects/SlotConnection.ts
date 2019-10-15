import * as Phaser from 'phaser';
import {Board} from '../core/Board';
import {Slot} from './Slot';
import {Orientation} from '../util/Orientation';
import Line = Phaser.Geom.Line;

export class SlotConnection extends Phaser.GameObjects.Graphics {
  public static count: number = 0;
  public readonly board: Board;
  public readonly slots: Slot[];
  public readonly shape: Line;
  public lineColor: number = 0xFFFFFF;
  public lineWidth: number = 1;
  public orientation: Orientation;
  public id: string;

  constructor(board: Board, slots: Slot[]) {
    super(board.scene);

    this.id    = String(SlotConnection.count++);
    this.board = board;
    this.slots = slots;
    this.shape = new Line(this.slots[0].x, this.slots[0].y, this.slots[1].x, this.slots[1].y);
    this.board.connections.push(this);

    this.setOrientation();
    this.render();
  }

  render() {
    this.clear();
    this.lineStyle(this.lineWidth, this.lineColor);
    this.strokeLineShape(this.shape);
  }


  setOrientation() {
    if (this.slots[0].y === this.slots[1].y || this.slots[0].y + 1 > this.slots[1].y && this.slots[0].y - 1 < this.slots[1].y) {
      this.orientation = Orientation.L_R;
      return;
    }

    const leftSlot  = this.slots[0].x < this.slots[1].x ? this.slots[0] : this.slots[1];
    const rightSlot = this.getConnectedSlot(leftSlot);

    if (leftSlot.y > rightSlot.y) {
      this.orientation = Orientation.BL_TR;
    } else {
      this.orientation = Orientation.BR_TL;
    }
  }

  hasConnectionTo(id: string) {
    return !!this.slots.find(slot => slot.id === id);
  }

  getConnectedSlot(origin: Slot) {
    if (this.slots.find(slot => slot.id === origin.id)) {
      return this.slots.find(slot => slot.id !== origin.id);
    }
    throw new Error('Provided Slot not part of the connection');
  }
}
