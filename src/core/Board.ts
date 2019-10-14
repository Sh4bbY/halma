import {BoardSlot} from './BoardSlot';
import {BoardSlotConnection} from './BoardSlotConnection';

export class Board {
  private static readonly slotConnections = 6;
  private static readonly slotDistance = 50;
  public readonly slots: BoardSlot[] = [];
  public readonly connections: BoardSlotConnection[] = [];
  public readonly width: number;
  public readonly height: number;

  constructor(width: number = 800, height: number = 600) {
    this.width = width;
    this.height = height;

    this.createNeutralSlots();
    this.createStartingSlots();
  }

  private createNeutralSlots(size = 1) {
    const centerSlot = new BoardSlot(this, this.width / 2, this.height / 2);

    this.createSurroundingSlots(centerSlot);
    centerSlot.connections.forEach(connection => this.createSurroundingSlots(connection.getConnectedSlot(centerSlot)));

    for (let i = 0; i < size; i++) {
      const outerSlots = this.slots.filter(slot => slot.connections.length <= 2);
      outerSlots.forEach(slot => this.createSurroundingSlots(slot));
    }

    this.connectOuterSlots();
  }

  private connectOuterSlots() {
    const outerSlots = this.slots.filter(slot => slot.connections.length <= 2);

    outerSlots.forEach(outerSlot => {
      const closeSlots = outerSlot.getConnectedSlots().reduce((acc, midSlot) => acc.concat(midSlot.getConnectedSlots()), []);
      const inRangeSlots = closeSlots.filter(s => outerSlot.getDistanceTo(s) <= Board.slotDistance + 1 && outerSlot.id !== s.id);

      inRangeSlots.forEach(s => {
        const connection = new BoardSlotConnection(this, [outerSlot, s]);
        outerSlot.connections.push(connection);
        s.connections.push(connection);
      });
    });
  }

  private createStartingSlots() {
    const midSlots = this.slots.filter(slot => slot.connections.length === 4);
    console.log(midSlots.length);
    midSlots.forEach(slot => this.createSurroundingSlots(slot));
  }

  private createSurroundingSlots(slot: BoardSlot) {
    for (let i = 0; i < Board.slotConnections; i++) {
      const pos = this.getNeighbourCoordinates(slot, i);
      const connectedSlot = this.getSlot(BoardSlot.getId(pos.x, pos.y)) || new BoardSlot(this, pos.x, pos.y);

      if (!slot.hasConnectionTo(connectedSlot.id)) {
        const connection = new BoardSlotConnection(this, [slot, connectedSlot]);
        slot.connections.push(connection);
        connectedSlot.connections.push(connection);
      }
    }
  }

  private getSlot(id: string) {
    return this.slots.find(slot => slot.id === id);
  }

  private getNeighbourCoordinates(slot, i) {
    const radius = Board.slotDistance;
    const angle = degrees_to_radians((360 / Board.slotConnections) * i);
    const x = slot.shape.x + radius * Math.cos(angle);
    const y = slot.shape.y + radius * Math.sin(angle);

    return {x, y};
  }
}

function degrees_to_radians(degrees) {
  var pi = Math.PI;
  return degrees * (pi / 180);
}
