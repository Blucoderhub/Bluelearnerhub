import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { verifyAccessToken } from '../utils/jwt';
import logger from '../utils/logger';
import { config } from '../config';

export class SocketService {
  private io: SocketIOServer;
  private connectedUsers: Map<number, string> = new Map();

  constructor(httpServer: HttpServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: config.corsOrigins,
        credentials: true,
      },
    });

    this.setupMiddleware();
    this.setupEventHandlers();
  }

  private setupMiddleware() {
    this.io.use((socket: Socket, next) => {
      const token = socket.handshake.auth?.token as string | undefined;

      if (!token) {
        next(new Error('Authentication error'));
        return;
      }

      try {
        const decoded = verifyAccessToken(token);
        socket.data.userId = decoded.userId;
        socket.data.userEmail = decoded.email;
        next();
      } catch (_error) {
        next(new Error('Authentication error'));
      }
    });
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket: Socket) => {
      const userId = socket.data.userId as number;

      logger.info(`User connected: ${userId} (socket: ${socket.id})`);
      this.connectedUsers.set(userId, socket.id);

      socket.join(`user:${userId}`);

      socket.on('quiz:start', (data) => this.handleQuizStart(socket, data));
      socket.on('quiz:answer', (data) => this.handleQuizAnswer(socket, data));
      socket.on('quiz:submit', (data) => this.handleQuizSubmit(socket, data));

      socket.on('hackathon:join', (data) => this.handleHackathonJoin(socket, data));
      socket.on('hackathon:code-update', (data) => this.handleCodeUpdate(socket, data));
      socket.on('hackathon:submission', (data) => this.handleSubmission(socket, data));

      socket.on('interview:join', (data) => this.handleInterviewJoin(socket, data));
      socket.on('interview:message', (data) => this.handleInterviewMessage(socket, data));

      socket.on('disconnect', () => {
        logger.info(`User disconnected: ${userId}`);
        this.connectedUsers.delete(userId);
      });
    });
  }

  private handleQuizStart(socket: Socket, data: any) {
    const userId = socket.data.userId as number;
    socket.join(`quiz:${data.quizId}`);

    logger.info(`User ${userId} started quiz ${data.quizId}`);

    this.io.to(`quiz:${data.quizId}`).emit('quiz:user-joined', {
      userId,
      timestamp: new Date(),
    });
  }

  private handleQuizAnswer(socket: Socket, data: any) {
    socket.emit('quiz:answer-received', {
      questionId: data.questionId,
      timestamp: new Date(),
    });
  }

  private handleQuizSubmit(socket: Socket, data: any) {
    const userId = socket.data.userId as number;

    logger.info(`User ${userId} submitted quiz ${data.quizId}`);
    socket.leave(`quiz:${data.quizId}`);
  }

  private handleHackathonJoin(socket: Socket, data: any) {
    const userId = socket.data.userId as number;
    socket.join(`hackathon:${data.hackathonId}`);

    logger.info(`User ${userId} joined hackathon ${data.hackathonId}`);

    this.io.to(`hackathon:${data.hackathonId}`).emit('hackathon:user-joined', {
      userId,
      timestamp: new Date(),
    });
  }

  private handleCodeUpdate(socket: Socket, data: any) {
    const userId = socket.data.userId as number;

    if (data.teamId) {
      socket.to(`team:${data.teamId}`).emit('hackathon:code-updated', {
        userId,
        code: data.code,
        language: data.language,
        timestamp: new Date(),
      });
    }
  }

  private handleSubmission(socket: Socket, data: any) {
    const userId = socket.data.userId as number;

    logger.info(`User ${userId} submitted code for hackathon ${data.hackathonId}`);

    socket.emit('hackathon:submission-received', {
      submissionId: data.submissionId,
      timestamp: new Date(),
    });

    this.io.to(`hackathon:${data.hackathonId}`).emit('hackathon:leaderboard-update', {
      timestamp: new Date(),
    });
  }

  private handleInterviewJoin(socket: Socket, data: any) {
    const userId = socket.data.userId as number;
    socket.join(`interview:${data.sessionId}`);

    logger.info(`User ${userId} joined interview session ${data.sessionId}`);

    socket.to(`interview:${data.sessionId}`).emit('interview:participant-joined', {
      userId,
      timestamp: new Date(),
    });
  }

  private handleInterviewMessage(socket: Socket, data: any) {
    const userId = socket.data.userId as number;

    socket.to(`interview:${data.sessionId}`).emit('interview:message', {
      userId,
      message: data.message,
      timestamp: new Date(),
    });
  }

  public emitToUser(userId: number, event: string, data: any) {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.io.to(socketId).emit(event, data);
    }
  }

  public emitToRoom(room: string, event: string, data: any) {
    this.io.to(room).emit(event, data);
  }

  public broadcastToAll(event: string, data: any) {
    this.io.emit(event, data);
  }

  public close(): Promise<void> {
    return new Promise((resolve) => {
      this.io.close(() => {
        logger.info('✓ Socket.IO server closed');
        resolve();
      });
    });
  }
}
