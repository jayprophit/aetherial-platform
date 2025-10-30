# Aetherial Platform API Documentation

## Table of Contents
- [Authentication](#authentication)
- [Users](#users)
- [Content](#content)
- [AI Services](#ai-services)
- [Blockchain](#blockchain)
- [WebSocket](#websocket)

## Base URL
```
https://api.aetherialplatform.com/v1
```

## Authentication

### Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "username": "johndoe",
    "avatar": "https://..."
  }
}
```

## Users

### Get Current User
```http
GET /users/me
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "username": "johndoe",
  "avatar": "https://...",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

## Content

### Create Post
```http
POST /posts
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (form-data):**
- `content`: (string) Post content
- `media`: (file, optional) Media files
- `visibility`: (string) public|private|friends

## AI Services

### Generate Text
```http
POST /ai/generate
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "prompt": "Write a short story about",
  "max_tokens": 100,
  "temperature": 0.7
}
```

## Blockchain

### Get Wallet Balance
```http
GET /wallet/balance
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "balance": "1.2345",
  "currency": "AETH",
  "address": "0x..."
}
```

## WebSocket

### Connection
```
wss://api.aetherialplatform.com/ws
```

### Events
- `message`: New message received
- `notification`: New notification
- `presence`: User online/offline status

### Example
```javascript
const socket = new WebSocket('wss://api.aetherialplatform.com/ws?token=...');

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
};

// Send a message
socket.send(JSON.stringify({
  type: 'message',
  content: 'Hello, world!',
  channel: 'general'
}));
```

## Error Handling

All error responses follow this format:
```json
{
  "error": {
    "code": "error_code",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

### Common Error Codes
- `400`: Bad Request - Invalid request data
- `401`: Unauthorized - Authentication required
- `403`: Forbidden - Insufficient permissions
- `404`: Not Found - Resource not found
- `429`: Too Many Requests - Rate limit exceeded
- `500`: Internal Server Error - Something went wrong

## Rate Limiting
- 1000 requests per hour per IP address
- 100 requests per minute per authenticated user

## Webhooks

### Available Webhooks
- `user.created`: Triggered when a new user signs up
- `payment.processed`: Triggered when a payment is processed
- `content.flagged`: Triggered when content is flagged for moderation

### Webhook Payload Example
```json
{
  "event": "user.created",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "createdAt": "2023-01-01T00:00:00.000Z"
  },
  "timestamp": 1672531200000
}
```

## Versioning

API versioning is done through the URL path:
- Current version: `v1`
- Example: `https://api.aetherialplatform.com/v1/...`

## Deprecation Policy
- Endpoints will be marked as deprecated at least 3 months before removal
- Deprecated endpoints will return a `Deprecation: true` header
- Breaking changes will result in a new API version
