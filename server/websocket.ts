import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

interface AuthenticatedWebSocket extends WebSocket {
  userId?: number;
  isAlive?: boolean;
}

interface OnlineUser {
  userId: number;
  ws: AuthenticatedWebSocket;
}

export class WebSocketManager {
  private wss: WebSocketServer;
  private onlineUsers: Map<number, AuthenticatedWebSocket> = new Map();

  constructor(server: Server) {
    this.wss = new WebSocketServer({ server, path: '/ws' });
    this.initialize();
  }

  private initialize() {
    this.wss.on('connection', (ws: AuthenticatedWebSocket, req) => {
      console.log('New WebSocket connection');
      ws.isAlive = true;

      // Handle authentication
      const token = new URL(req.url!, `http://${req.headers.host}`).searchParams.get('token');
      
      if (token) {
        try {
          const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
          ws.userId = decoded.userId;
          this.onlineUsers.set(decoded.userId, ws);
          console.log(`User ${decoded.userId} connected`);

          // Broadcast online status
          this.broadcastOnlineUsers();
        } catch (error) {
          console.error('WebSocket auth error:', error);
          ws.close(1008, 'Authentication failed');
          return;
        }
      }

      // Handle incoming messages
      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleMessage(ws, message);
        } catch (error) {
          console.error('Message parse error:', error);
        }
      });

      // Handle pong (heartbeat)
      ws.on('pong', () => {
        ws.isAlive = true;
      });

      // Handle disconnection
      ws.on('close', () => {
        if (ws.userId) {
          this.onlineUsers.delete(ws.userId);
          console.log(`User ${ws.userId} disconnected`);
          this.broadcastOnlineUsers();
        }
      });

      // Handle errors
      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    });

    // Heartbeat to detect broken connections
    setInterval(() => {
      this.wss.clients.forEach((ws: AuthenticatedWebSocket) => {
        if (ws.isAlive === false) {
          if (ws.userId) {
            this.onlineUsers.delete(ws.userId);
          }
          return ws.terminate();
        }

        ws.isAlive = false;
        ws.ping();
      });
    }, 30000); // 30 seconds
  }

  private handleMessage(ws: AuthenticatedWebSocket, message: any) {
    const { type, payload } = message;

    switch (type) {
      case 'message':
        this.handleChatMessage(ws, payload);
        break;
      
      case 'typing':
        this.handleTypingIndicator(ws, payload);
        break;
      
      case 'read':
        this.handleReadReceipt(ws, payload);
        break;
      
      default:
        console.log('Unknown message type:', type);
    }
  }

  private handleChatMessage(ws: AuthenticatedWebSocket, payload: any) {
    const { recipientId, content, conversationId } = payload;

    if (!ws.userId) return;

    const message = {
      type: 'message',
      payload: {
        senderId: ws.userId,
        recipientId,
        content,
        conversationId,
        timestamp: new Date().toISOString()
      }
    };

    // Send to recipient if online
    const recipientWs = this.onlineUsers.get(recipientId);
    if (recipientWs && recipientWs.readyState === WebSocket.OPEN) {
      recipientWs.send(JSON.stringify(message));
    }

    // Send confirmation back to sender
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'message_sent',
        payload: { conversationId, timestamp: message.payload.timestamp }
      }));
    }
  }

  private handleTypingIndicator(ws: AuthenticatedWebSocket, payload: any) {
    const { recipientId, isTyping } = payload;

    if (!ws.userId) return;

    const recipientWs = this.onlineUsers.get(recipientId);
    if (recipientWs && recipientWs.readyState === WebSocket.OPEN) {
      recipientWs.send(JSON.stringify({
        type: 'typing',
        payload: {
          userId: ws.userId,
          isTyping
        }
      }));
    }
  }

  private handleReadReceipt(ws: AuthenticatedWebSocket, payload: any) {
    const { senderId, messageId } = payload;

    if (!ws.userId) return;

    const senderWs = this.onlineUsers.get(senderId);
    if (senderWs && senderWs.readyState === WebSocket.OPEN) {
      senderWs.send(JSON.stringify({
        type: 'read',
        payload: {
          messageId,
          readBy: ws.userId,
          readAt: new Date().toISOString()
        }
      }));
    }
  }

  private broadcastOnlineUsers() {
    const onlineUserIds = Array.from(this.onlineUsers.keys());
    
    const message = JSON.stringify({
      type: 'online_users',
      payload: { userIds: onlineUserIds }
    });

    this.wss.clients.forEach((ws: AuthenticatedWebSocket) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(message);
      }
    });
  }

  // Public method to send notifications
  public sendNotification(userId: number, notification: any) {
    const ws = this.onlineUsers.get(userId);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'notification',
        payload: notification
      }));
    }
  }

  // Public method to broadcast to all users
  public broadcast(message: any) {
    const data = JSON.stringify(message);
    this.wss.clients.forEach((ws: AuthenticatedWebSocket) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(data);
      }
    });
  }

  // Get online status
  public isUserOnline(userId: number): boolean {
    return this.onlineUsers.has(userId);
  }

  // Get online users count
  public getOnlineUsersCount(): number {
    return this.onlineUsers.size;
  }
}

export default WebSocketManager;

