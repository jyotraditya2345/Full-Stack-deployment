import type { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import type { Task, Notification } from '@prisma/client';
import { env } from '../config/env';

class SocketService {
  private io?: Server;

  init(server: HttpServer) {
    this.io = new Server(server, {
      cors: {
        origin: env.clientUrl,
        credentials: true
      }
    });

    this.io.on('connection', (socket) => {
      const userId = socket.handshake.auth?.userId as string | undefined;
      if (userId) {
        socket.join(userId);
      }
    });
  }

  emitTaskUpdated(task: Task) {
    this.io?.emit('task:updated', task);
  }

  emitTaskAssigned(userId: string, payload: { task: Task; notification: Notification }) {
    this.io?.to(userId).emit('task:assigned', payload);
  }
}

export const socketService = new SocketService();
