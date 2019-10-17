import {MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse} from '@nestjs/websockets';
import {from, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Server} from 'socket.io';
import {Logger} from '@nestjs/common';

@WebSocketGateway()
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  logger: Logger = new Logger('Gateway');

  @WebSocketServer() server: Server;

  private clients: number = 0;
  private gameRooms: any  = {};
  private players         = [];

  constructor() {
    this.gameRooms.halma2Players = {players: []};
    this.gameRooms.halma3Players = {players: []};
    this.gameRooms.halma4Players = {players: []};
    this.gameRooms.halma5Players = {players: []};
    this.gameRooms.halma6Players = {players: []};
  }


  async handleConnection() {
    this.clients++;
    this.server.emit('clients', this.clients);
    console.log('client connected');
  }

  async handleDisconnect() {
    this.clients--;
    this.server.emit('clients', this.clients);
    console.log('client disconnected');
  }


  @SubscribeMessage('events')
  findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
    return from([1, 2, 3]).pipe(map(item => ({event: 'events', data: item})));
  }

  @SubscribeMessage('game-search')
  async searchForGame(@MessageBody() data: any): Promise<any> {
    this.logger.log(`game-search, player: ${data.playerName}`);
    this.players.push(data.playerName);

    if (data.gameTypes.is2PlayerGame) {
      this.gameRooms.halma2Players.players.push(data.playerName);
    }
    if (data.gameTypes.is3PlayerGame) {
      this.gameRooms.halma3Players.players.push(data.playerName);
    }
    if (data.gameTypes.is4PlayerGame) {
      this.gameRooms.halma4Players.players.push(data.playerName);
    }
    if (data.gameTypes.is5PlayerGame) {
      this.gameRooms.halma5Players.players.push(data.playerName);
    }
    if (data.gameTypes.is6PlayerGame) {
      this.gameRooms.halma6Players.players.push(data.playerName);
    }
    this.server.emit('game-search', this.players);
    return this.players;
  }

  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    return data;
  }
}
