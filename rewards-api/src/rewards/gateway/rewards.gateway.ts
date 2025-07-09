import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*', // Allow cross-origin access for development
  },
  namespace: '/rewards', // Custom namespace for reward-related sockets
})
export class RewardsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(RewardsGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    // Could add logic to authenticate or store connection metadata here
  }

  handleDisconnect(client: Socket) {
    this.logger.warn(`Client disconnected: ${client.id}`);
    // Cleanup operations like unsubscribing or invalidating session
  }

  // Emits updated reward points to all clients
  sendUpdatedPoints(userId: string, totalPoints: number) {
    const payload = { userId, totalPoints };
    this.logger.debug(`Emitting 'reward-update' with payload: ${JSON.stringify(payload)}`);
    this.server.emit('reward-update', payload);
  }

  // Potential future handler for listening to client-side events
  // @SubscribeMessage('redeem-request')
  // handleRedeem(client: Socket, data: any) {
  //   this.logger.log(`Received redeem request: ${JSON.stringify(data)}`);
  //   // Validate and process redemption...
  // }
}
