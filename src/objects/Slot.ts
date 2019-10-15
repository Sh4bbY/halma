import {HalmaColor} from '../util/HalmaColor';
import Circle = Phaser.Geom.Circle;
import {Board} from '../core/Board';
import {SlotConnection} from './SlotConnection';

export class Slot extends Phaser.GameObjects.Graphics {
  private readonly board: Board;
  public readonly id: string;
  private static readonly radius       = 10;
  public connections: SlotConnection[] = [];
  public shape: Circle;
  public color: number                 = HalmaColor.WHITE;
  public teintColor: number            = null;
  public lineColor: number             = HalmaColor.WHITE;
  public lineWidth: number             = 3;
  public base: number;
  public isFree: boolean               = true;

  constructor(board: Board, x, y) {
    super(board.scene);

    this.board = board;
    this.id    = Slot.getId(x, y);
    this.shape = new Circle(0, 0, Slot.radius);

    this.x = x;
    this.y = y;

    this.render();

    this.board.slots.push(this);
  }

  render() {
    this.clear();
    this.lineStyle(this.lineWidth, this.lineColor);
    this.strokeCircleShape(this.shape);
    this.fillStyle(this.teintColor || this.color);
    this.fillCircleShape(this.shape);
  }

  setTeint(color: HalmaColor) {
    this.teintColor = color;
    this.render();
  }

  clearTeint() {
    this.teintColor = null;
    this.render();
  }

  public setBase(base: number) {
    this.base = base;
    // this.lineColor = Board.baseColors[base];
    // this.lineWidth = 5;
    this.render();
  }

  public getConnectionTo(slot: Slot): SlotConnection {
    return this.connections.find(conn => conn.slots.findIndex(s => s.id === this.id) >= 0 && conn.slots.findIndex(s => s.id === slot.id) >= 0);
  }

  public getDistanceToSlot(slot: Slot): number {
    return this.getDistanceTo(slot.x, slot.y);
  }

  public getDistanceTo(x: number, y: number): number {
    return Math.sqrt(Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2));
  }

  public hasConnectionTo(id: string): boolean {
    return this.connections.reduce((accumulator, conn) => accumulator || conn.hasConnectionTo(id), false);
  }

  public getConnectedSlots(): Slot[] {
    return this.connections.map(conn => conn.getConnectedSlot(this));
  }

  static getId(x, y) {
    return `${Math.round(x)}-${Math.round(y)}`;
  }
}
