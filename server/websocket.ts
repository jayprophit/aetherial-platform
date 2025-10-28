import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

interface AuthenticatedWebSocket extends WebSocket {
  userId?: number;
  isAlive?: boolean;
  channels: Set<string>;
}

export class WebSocketManager {
  private wss: WebSocketServer;
  private onlineUsers: Map<number, AuthenticatedWebSocket> = new Map();
  private channels: Map<string, Set<AuthenticatedWebSocket>> = new Map();

  constructor(server: Server) {
    this.wss = new WebSocketServer({ server, path: '/ws' });
    this.initialize();
  }

  private initialize() {
    this.wss.on('connection', (ws: AuthenticatedWebSocket, req) => {
      console.log('New WebSocket connection');
      ws.isAlive = true;
      ws.channels = new Set();

      const token = new URL(req.url!, `http://${req.headers.host}`).searchParams.get('token');
      
      if (token) {
        try {
          const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
          ws.userId = decoded.userId;
          this.onlineUsers.set(decoded.userId, ws);
          console.log(`User ${decoded.userId} connected`);
          this.broadcastOnlineUsers();
        } catch (error) {
          console.error('WebSocket auth error:', error);
          ws.close(1008, 'Authentication failed');
          return;
        }
      }

      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleMessage(ws, message);
        } catch (error) {
          console.error('Message parse error:', error);
        }
      });

      ws.on('pong', () => { ws.isAlive = true; });

      ws.on('close', () => {
        if (ws.userId) {
          this.onlineUsers.delete(ws.userId);
          console.log(`User ${ws.userId} disconnected`);
          this.broadcastOnlineUsers();
        }
        ws.channels.forEach(channel => this.unsubscribe(ws, channel));
      });

      ws.on('error', (error) => { console.error('WebSocket error:', error); });
    });

    setInterval(() => {
      this.wss.clients.forEach((ws: AuthenticatedWebSocket) => {
        if (ws.isAlive === false) {
          if (ws.userId) this.onlineUsers.delete(ws.userId);
          return ws.terminate();
        }
        ws.isAlive = false;
        ws.ping();
      });
    }, 30000);
  }

  private handleMessage(ws: AuthenticatedWebSocket, message: any) {
    const { type, payload } = message;
    switch (type) {
      case 'subscribe': this.subscribe(ws, payload.channel); break;
      case 'unsubscribe': this.unsubscribe(ws, payload.channel); break;
      case 'channel_broadcast': this.broadcastToChannel(payload.channel, payload.message, ws.userId); break;
      default: console.log('Unknown message type:', type);
    }
  }

  private subscribe(ws: AuthenticatedWebSocket, channel: string) {
    if (!this.channels.has(channel)) {
      this.channels.set(channel, new Set());
    }
    this.channels.get(channel)!.add(ws);
    ws.channels.add(channel);
    console.log(`User ${ws.userId} subscribed to channel: ${channel}`);
  }

  private unsubscribe(ws: AuthenticatedWebSocket, channel: string) {
    if (this.channels.has(channel)) {
      this.channels.get(channel)!.delete(ws);
      if (this.channels.get(channel)!.size === 0) {
        this.channels.delete(channel);
      }
    }
    ws.channels.delete(channel);
    console.log(`User ${ws.userId} unsubscribed from channel: ${channel}`);
  }

  private broadcastToChannel(channel: string, message: any, senderId?: number) {
    const subscribers = this.channels.get(channel);
    if (subscribers) {
      const data = JSON.stringify({ type: 'channel_message', payload: { channel, message, senderId } });
      subscribers.forEach(ws => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(data);
        }
      });
    }
  }

  private broadcastOnlineUsers() {
    const onlineUserIds = Array.from(this.onlineUsers.keys());
    const message = JSON.stringify({ type: 'online_users', payload: { userIds: onlineUserIds } });
    this.wss.clients.forEach((ws: AuthenticatedWebSocket) => {
      if (ws.readyState === WebSocket.OPEN) ws.send(message);
    });
  }

  public sendNotification(userId: number, notification: any) {
    const ws = this.onlineUsers.get(userId);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'notification', payload: notification }));
    }
  }

  public broadcast(message: any) {
    const data = JSON.stringify(message);
    this.wss.clients.forEach((ws: AuthenticatedWebSocket) => {
      if (ws.readyState === WebSocket.OPEN) ws.send(data);
    });
  }

  public isUserOnline(userId: number): boolean { return this.onlineUsers.has(userId); }
  public getOnlineUsersCount(): number { return this.onlineUsers.size; }
}

export default WebSocketManager;
