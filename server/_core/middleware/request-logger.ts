import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/logger';

// Add request ID to each request
export const requestId = (req: Request, res: Response, next: NextFunction) => {
  req.id = uuidv4();
  res.setHeader('X-Request-ID', req.id);
  next();
};

// Log HTTP requests
export const httpLogger = (req: Request, res: Response, next: NextFunction) => {
  // Skip health check logging
  if (req.path === '/health') {
    return next();
  }

  const start = Date.now();
  const { method, originalUrl, ip, headers, body } = req;
  
  // Skip sensitive data from logs
  const sanitizedBody = { ...body };
  if (sanitizedBody.password) sanitizedBody.password = '***';
  if (sanitizedBody.newPassword) sanitizedBody.newPassword = '***';
  if (sanitizedBody.currentPassword) sanitizedBody.currentPassword = '***';
  if (sanitizedBody.token) sanitizedBody.token = '***';

  // Log request
  logger.http('Incoming Request', {
    requestId: req.id,
    method,
    url: originalUrl,
    ip,
    userAgent: headers['user-agent'],
    body: sanitizedBody,
  });

  // Log response
  const originalSend = res.send;
  res.send = function (body) {
    const responseTime = Date.now() - start;
    
    // Log response
    logger.http('Outgoing Response', {
      requestId: req.id,
      method,
      url: originalUrl,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      contentLength: res.get('content-length'),
    });
    
    return originalSend.call(this, body);
  };

  next();
};

// Error logging middleware
export const errorLogger = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Request Error', {
    requestId: req.id,
    error: {
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      name: err.name,
    },
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
  });

  next(err);
};

// 404 handler
export const notFoundHandler = (req: Request, res: Response) => {
  logger.warn('Route not found', {
    requestId: req.id,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
  });

  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
};
