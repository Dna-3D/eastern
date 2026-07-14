// ============================================================
// Eastern Gist API - Main Entry Point
// ============================================================

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { prisma } from './lib/prisma.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.js';

// Validate critical env vars
const requiredEnvVars = ['DATABASE_URL', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`FATAL: Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

const app = express();
const server = http.createServer(app);
const PORT = parseInt(process.env.PORT || '3001', 10);

// ============================================================
// Socket.io Server (initialized for future phases)
// ============================================================

const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  },
  pingInterval: 10000,
  pingTimeout: 5000,
});

// Namespace for chat
const chatNamespace = io.of('/chat');
chatNamespace.on('connection', (socket) => {
  console.log(`[Chat] Client connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`[Chat] Client disconnected: ${socket.id}`);
  });
});

// Namespace for notifications
const notificationNamespace = io.of('/notifications');
notificationNamespace.on('connection', (socket) => {
  console.log(`[Notifications] Client connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`[Notifications] Client disconnected: ${socket.id}`);
  });
});

// Store io instance for use in routes
app.set('io', io);
app.set('chatNamespace', chatNamespace);
app.set('notificationNamespace', notificationNamespace);

// ============================================================
// Middleware
// ============================================================

// Security headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate limiting on auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 requests per window
  message: { success: false, error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ============================================================
// Routes
// ============================================================

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Eastern Gist API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Auth routes (with rate limiting)
app.use('/api/auth', authLimiter, authRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Global error handler
app.use(errorHandler);

// ============================================================
// Start Server
// ============================================================

async function start() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('[DB] Connected to database successfully');

    server.listen(PORT, () => {
      console.log(`[Server] Eastern Gist API running on port ${PORT}`);
      console.log(`[Server] Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`[Server] Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('[FATAL] Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n[Server] Shutting down gracefully...');
  await prisma.$disconnect();
  io.close();
  server.close(() => {
    console.log('[Server] Server closed');
    process.exit(0);
  });
});

process.on('SIGTERM', async () => {
  console.log('\n[Server] Shutting down gracefully...');
  await prisma.$disconnect();
  io.close();
  server.close(() => {
    console.log('[Server] Server closed');
    process.exit(0);
  });
});

start();