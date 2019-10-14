import * as Phaser from 'phaser';
import {BoardSlot} from './BoardSlot';
import {Player} from './Player';
import Circle = Phaser.Geom.Circle;

export class Pin {
  private player: Player;
  public shape: Circle;
  public slot: BoardSlot;

  constructor() {

  }
}
