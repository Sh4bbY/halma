import {HalmaColor} from '../util/HalmaColor';
import Circle = Phaser.Geom.Circle;
import {Slot} from './Slot';
import {Board} from '../core/Board';
import {Player} from '../core/Player';
import {GameScene} from '../scenes/GameScene';

export class Pin extends Phaser.GameObjects.Graphics {
  private static readonly radius = 12;
  public readonly shape: Circle;
  public slot: Slot;
  public lineColor: HalmaColor   = HalmaColor.WHITE;
  public lineWidth: number       = 0;
  public teint: HalmaColor       = null;
  public player: Player;
  public color: HalmaColor;
  protected scene: GameScene;

  constructor(board: Board, slot: Slot, player: Player) {
    super(board.scene);

    this.player = player;
    this.color  = player.color;
    this.shape  = new Circle(0, 0, Pin.radius);

    this.setSlot(slot);
    this.render();

    this.setInteractive(this.shape, Phaser.Geom.Circle.Contains);
    this.scene.input.setDraggable(this);


    this.scene.input.on('dragstart', (pointer, gameObject) => {
      if (this.scene.currentPlayer.color !== gameObject.color) {
        return;
      }
      gameObject.getAvailableSlots().forEach(slot => slot.setTeint(HalmaColor.GRAY));
      gameObject.shape.radius = 16;
      gameObject.render();
    });

    this.scene.input.on('dragend', (pointer, gameObject) => {
      if (this.scene.currentPlayer.color !== gameObject.color) {
        return;
      }
      gameObject.getAvailableSlots().forEach(slot => slot.clearTeint());
      gameObject.shape.radius = Pin.radius;
      gameObject.lineWidth = 0;
      gameObject.render();
      const availableSlots = gameObject.getAvailableSlots();
      const closeSlot      = availableSlots.find(slot => slot.getDistanceTo(gameObject.x, gameObject.y) < 12);
      if (closeSlot) {
        gameObject.slot.isFree = true;
        gameObject.setSlot(closeSlot);
        this.scene.movedPin();
        return;
      }
      gameObject.x = gameObject.slot.x;
      gameObject.y = gameObject.slot.y;
    });
  }

  setSlot(slot: Slot) {
    this.slot        = slot;
    this.slot.isFree = false;
    this.x           = slot.x;
    this.y           = slot.y;
  }

  getAvailableSlots() {
    const connectedSlots     = this.slot.getConnectedSlots();
    const freeConnectedSlots = connectedSlots.filter(slot => slot.isFree);

    const jumpSlots = this.getJumpSlots(this.slot);

    return freeConnectedSlots.concat(jumpSlots);
  }

  private getJumpSlots(startSlot: Slot, jumpSlots: Slot[] = []): Slot[] {
    const connectedSlots     = startSlot.getConnectedSlots();
    const usedConnectedSlots = connectedSlots.filter(slot => !slot.isFree);

    usedConnectedSlots.forEach(cs => {
      const conn  = cs.getConnectionTo(startSlot);
      const conn2 = cs.connections.find(c => c.id !== conn.id && c.orientation === conn.orientation);
      if (!conn2) {
        return;
      }

      const slot = conn2.getConnectedSlot(cs);
      if (slot.isFree && jumpSlots.findIndex(js => js.id === slot.id) === -1) {
        jumpSlots.push(slot);
        jumpSlots = jumpSlots.concat(this.getJumpSlots(slot, jumpSlots));
      }
    });

    return jumpSlots;
  }

  render() {
    this.clear();
    this.lineStyle(this.lineWidth, this.lineColor);
    this.strokeCircleShape(this.shape);
    this.fillStyle(this.teint || this.player.color);
    this.fillCircleShape(this.shape);
  }
}
