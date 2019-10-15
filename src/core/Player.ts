import {HalmaColor} from '../util/HalmaColor';

export class Player {
  public readonly name: string;
  public readonly color: HalmaColor;
  public readonly colorString: string;

  constructor(name: string, color: HalmaColor, colorString: string) {
    this.name        = name;
    this.color       = color;
    this.colorString = colorString;
  }
}
