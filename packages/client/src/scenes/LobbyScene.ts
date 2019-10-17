import * as io from 'socket.io-client';
import {Halma} from '../Halma';


export class LobbyScene extends Phaser.Scene {

  public game: Halma;

  constructor() {
    super({
      key: 'LobbyScene',
    });
  }

  init(): void {
    this.connectToWebSocket();
  }

  preload() {
    this.load.html('lobby-form', '/assets/html/lobby-form.html');
    this.load.image('test', '../assets/img/germany.png');
  }

  create(): void {
    const text = this.add.text(0, 100, 'Halma Online - Lobby');
    text.setAlign('center');
    text.setFixedSize(Number(this.game.config.width), 100);

    // this.add.image(200, 200, 'test');
    const form = this.add.dom(400, 200).createFromCache('lobby-form');
    form.addListener('click');

    const game = this.game;

    form.on('click', function (event) {
      if (event.target.name === 'search-btn') {
        const playerName = this.getChildByName('player-name').value;

        if (playerName.length === 0) {
          console.log('No player name provided');
          return;
        }

        const gameTypes = {
          is2PlayerGame: this.getChildByName('game-type2').checked,
          is3PlayerGame: this.getChildByName('game-type3').checked,
          is4PlayerGame: this.getChildByName('game-type4').checked,
          is5PlayerGame: this.getChildByName('game-type5').checked,
          is6PlayerGame: this.getChildByName('game-type6').checked,
        };

        game.socket.emit('game-search', {playerName, gameTypes});
        this.removeListener('click');
        this.setVisible(false);
      }
    });
  }

  update(time): void {
  }

  connectToWebSocket() {
    const socket     = io('http://localhost:3000');
    this.game.socket = socket;

    socket.on('connect', () => {
      console.log('connected');
    });
    socket.on('event', (data) => {
      console.log('event', data);
    });
    socket.on('game-search', (data) => {
      console.log('game-search', data);
    });
    socket.on('disconnect', () => {
      console.log('disconnected');
    });
  }
}
