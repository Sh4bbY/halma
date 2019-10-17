import {Slot} from '../objects/Slot';
import {SlotConnection} from '../objects/SlotConnection';
import {Pin} from '../objects/Pin';
import {BoardBase} from '../util/BoardBase';
import Scene = Phaser.Scene;
import {Player} from './Player';

export class Board {
  private static readonly slotConnections       = 6;
  private static readonly slotDistance          = 50;
  public readonly slots: Slot[]                 = [];
  public readonly pins: Pin[]                   = [];
  public readonly players: Player[]             = [];
  public readonly connections: SlotConnection[] = [];
  public readonly scene: Scene;
  public readonly isLarge: boolean;

  constructor(scene: Scene, players: Player[], isLarge: boolean = false) {
    this.scene   = scene;
    this.players = players;
    this.isLarge = isLarge;

    this.createBoard();
    this.placePins();
  }

  private placePins() {
    switch (this.players.length) {
      case 2:
        this.placeBasePins([BoardBase.N, BoardBase.S]);
        break;
      case 3:
        this.placeBasePins([BoardBase.N, BoardBase.SO, BoardBase.SW]);
        break;
      case 4:
        this.placeBasePins([BoardBase.NW, BoardBase.NO, BoardBase.SO, BoardBase.SW]);
        break;
      case 5:
        this.placeBasePins([BoardBase.N, BoardBase.NW, BoardBase.NO, BoardBase.SO, BoardBase.SW]);
        break;
      case 6:
        this.placeBasePins([BoardBase.N, BoardBase.NW, BoardBase.NO, BoardBase.SO, BoardBase.SW, BoardBase.S]);
        break;
      default:
        throw new Error(`Invalid number of Players: ${this.players}`);
    }
  }

  private placeBasePins(bases: BoardBase[]) {
    for (let i = 0; i < this.players.length; i++) {
      const base      = bases[i];
      const player    = this.players[i];
      const baseSlots = this.slots.filter(slot => slot.base === base);
      baseSlots.forEach(slot => this.pins.push(new Pin(this, slot, player)));
    }
  }

  private createBoard() {
    this.createNeutralSlots();
    this.createStartingSlots();
  }

  private createNeutralSlots() {
    const x          = Number(this.scene.game.config.width) / 2;
    const y          = Number(this.scene.game.config.height) / 2;
    const centerSlot = new Slot(this, x, y);

    this.createSurroundingSlots(centerSlot);
    centerSlot.connections.forEach(connection => this.createSurroundingSlots(connection.getConnectedSlot(centerSlot)));

    const loops = this.isLarge ? 2 : 1;
    for (let i = 0; i < loops; i++) {
      const outerSlots = this.slots.filter(slot => slot.connections.length <= 2);
      outerSlots.forEach(slot => this.createSurroundingSlots(slot));
    }

    this.connectOuterSlots();
  }

  private connectOuterSlots() {
    const outerSlots = this.slots.filter(slot => slot.connections.length <= 2);

    outerSlots.forEach(outerSlot => {
      const closeSlots              = outerSlot.getConnectedSlots().reduce((acc, midSlot) => acc.concat(midSlot.getConnectedSlots()), []);
      const inRangeSlots            = closeSlots.filter(s => outerSlot.getDistanceToSlot(s) <= Board.slotDistance + 1 && outerSlot.id !== s.id);
      const unconnectedInRangeSlots = inRangeSlots.filter(s => !outerSlot.hasConnectionTo(s.id));

      unconnectedInRangeSlots.forEach(s => {
        const connection = new SlotConnection(this, [outerSlot, s]);
        outerSlot.connections.push(connection);
        s.connections.push(connection);
      });
    });
  }

  private createStartingSlots() {
    const midSlots = this.slots.filter(slot => slot.connections.length === 4);
    midSlots.forEach(slot => this.createSurroundingSlots(slot));
    this.connectOuterSlots();

    const midSlots2 = this.slots.filter(slot => slot.connections.length === 4);
    midSlots2.forEach(slot => this.createSurroundingSlots(slot));
    this.connectOuterSlots();

    if (this.isLarge) {
      const centerX   = Number(this.scene.game.config.width) / 2;
      const centerY   = Number(this.scene.game.config.height) / 2;
      const midSlots3 = this.slots.filter(slot => slot.connections.length === 4 && slot.getDistanceTo(centerX, centerY) > Board.slotDistance * 5);
      midSlots3.forEach(slot => this.createSurroundingSlots(slot));
      this.connectOuterSlots();
    }

    const outerSlots   = this.slots.filter(s => s.connections.length === 3);
    const tipSlotPairs = this.getTipSlotPairs(outerSlots);

    tipSlotPairs.forEach((pair, i) => {
      const newSlot     = this.createFinalStartSlot(pair[0], pair[1]);
      const connection0 = new SlotConnection(this, [newSlot, pair[0]]);
      const connection1 = new SlotConnection(this, [newSlot, pair[1]]);
      newSlot.connections.push(connection0);
      newSlot.connections.push(connection1);
      pair[0].connections.push(connection0);
      pair[1].connections.push(connection1);
      pair[0].setBase(i);
      pair[1].setBase(i);
      pair[0].getConnectedSlots().forEach(slot => {
        slot.setBase(i);
        if (this.isLarge) {
          slot.getConnectedSlots().forEach(slot => slot.setBase(i));
        }
      });
      pair[1].getConnectedSlots().forEach(slot => {
        slot.setBase(i);
        if (this.isLarge) {
          slot.getConnectedSlots().forEach(slot => slot.setBase(i));
        }
      });
    });
  }

  private getTipSlotPairs(outerSlots: Slot[]) {
    const tipSlotPairs   = [];
    const processedSlots = [];

    outerSlots.forEach(slot => {

      if (processedSlots.map(s => s.id).indexOf(slot.id) >= 0) {
        return;
      }

      const neighbour = slot.getConnectedSlots().find(s => s.connections.length === 3);
      processedSlots.push(slot);
      processedSlots.push(neighbour);
      tipSlotPairs.push([slot, neighbour]);
    });
    return tipSlotPairs;
  }

  private createFinalStartSlot(slot1: Slot, slot2: Slot) {
    const positions1 = {};
    const positions2 = {};
    for (let i = 0; i < Board.slotConnections; i++) {
      const pos1                             = this.getNeighbourCoordinates(slot1, i);
      const pos2                             = this.getNeighbourCoordinates(slot2, i);
      positions1[Slot.getId(pos1.x, pos1.y)] = pos1;
      positions2[Slot.getId(pos2.x, pos2.y)] = pos2;
    }

    const sharedPositions = {};
    for (const id in positions1) {
      if (positions2.hasOwnProperty(id)) {
        sharedPositions[id] = positions1[id];
      }
    }

    for (const id in sharedPositions) {
      if (!this.slots.find(s => s.id === id)) {
        const pos = sharedPositions[id];
        return new Slot(this, pos.x, pos.y);
      }
    }
  }


  private createSurroundingSlots(slot: Slot) {
    for (let i = 0; i < Board.slotConnections; i++) {
      const pos           = this.getNeighbourCoordinates(slot, i);
      const connectedSlot = this.getSlot(Slot.getId(pos.x, pos.y)) || new Slot(this, pos.x, pos.y);

      if (!slot.hasConnectionTo(connectedSlot.id)) {
        const connection = new SlotConnection(this, [slot, connectedSlot]);
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
    const angle  = degrees_to_radians((360 / Board.slotConnections) * i);
    const x      = slot.x + radius * Math.cos(angle);
    const y      = slot.y + radius * Math.sin(angle);

    return {x, y};
  }
}

function degrees_to_radians(degrees) {
  var pi = Math.PI;
  return degrees * (pi / 180);
}
