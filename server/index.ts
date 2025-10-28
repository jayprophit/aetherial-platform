import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import helmet from "helmet";
import { apiLimiter, authLimiter } from "./middleware/rateLimit";
import "./queues";
import { initializeNotificationService } from "./notifications";
import { initializeGameEngine } from "./gameEngine";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);
  
  // Initialize WebSocket server
  const { WebSocketManager } = await import("./websocket.js");
  const wsManager = new WebSocketManager(server);
  
  // Make WebSocket manager available to routes
  app.locals.wsManager = wsManager;
  initializeNotificationService(wsManager);
  initializeGameEngine(wsManager);

  // Middleware
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Apply rate limiting
  app.use("/api/", apiLimiter);

  // API Routes
  app.use("/api/auth", authLimiter, (await import("./routes/auth.js")).default);
  app.use("/api/users", (await import("./routes/users.js")).default);
  app.use("/api/posts", (await import("./routes/posts.js")).default);
  app.use("/api/comments", (await import("./routes/comments.js")).default);
  app.use("/api/friends", (await import("./routes/friends.js")).default);
  app.use("/api/groups", (await import("./routes/groups.js")).default);
  app.use("/api/messages", (await import("./routes/messages.js")).default);
  app.use("/api/products", (await import("./routes/products.js")).default);
  app.use("/api/courses", (await import("./routes/courses.js")).default);
  app.use("/api/jobs", (await import("./routes/jobs.js")).default);
  app.use("/api/upload", (await import("./routes/upload.js")).default);
  app.use("/api/search", (await import("./routes/search.js")).default);
  app.use("/api/notifications", (await import("./routes/notifications.js")).default);
  app.use("/api/payments", (await import("./routes/payments.js")).default);
  app.use("/api/admin", (await import("./routes/admin.js")).default);
  app.use("/api/settings", (await import("./routes/settings.js")).default);
  app.use("/api/business", (await import("./routes/business.js")).default);
  app.use("/api/platform", (await import("./routes/platform.js")).default);
  app.use("/api/ai", (await import("./routes/ai.js")).default);
  app.use("/api/blockchain", (await import("./routes/blockchain.js")).default);
  app.use("/api/iot", (await import("./routes/iot.js")).default);
  app.use("/api/health", (await import("./routes/health.js")).default);
  app.use("/api/audit", (await import("./routes/audit.js")).default);
  app.use("/api/mfa", (await import("./routes/mfa.js")).default);
  app.use("/api/experimental", (await import("./routes/experimental.js")).default);
  app.use("/api/gamification", (await import("./routes/gamification.js")).default);
  app.use("/api/quests", (await import("./routes/quests.js")).default);
  app.use("/api/economy", (await import("./routes/economy.js")).default);
  app.use("/api/marketplace", (await import("./routes/marketplace.js")).default);
  app.use("/api/creator", (await import("./routes/creator.js")).default);
  app.use("/api/games", (await import("./routes/games.js")).default);
  app.use("/api/npcs", (await import("./routes/npcs.js")).default);
  app.use("/api/pcg", (await import("./routes/pcg.js")).default);
  app.use("/api/chat", (await import("./routes/chat.js")).default);
  app.use("/api/webauthn", (await import("./routes/webauthn.js")).default);
  app.use("/api/did", (await import("./routes/did.js")).default);
  app.use("/api/federated-learning", (await import("./routes/federated-learning.js")).default);
  app.use("/api/content-moderation", (await import("./routes/content-moderation.js")).default);
  app.use("/api/analytics", (await import("./routes/analytics.js")).default);
  app.use("/api/recommender", (await import("./routes/recommender.js")).default);
  app.use("/api/social-graph", (await import("./routes/social-graph.js")).default);
  app.use("/api/live-streaming", (await import("./routes/live-streaming.js")).default);
  app.use("/api/cloud-gaming", (await import("./routes/cloud-gaming.js")).default);
  app.use("/api/digital-twin", (await import("./routes/digital-twin.js")).default);
  app.use("/api/bci", (await import("./routes/bci.js")).default);
  app.use("/api/quantum-computing", (await import("./routes/quantum-computing.js")).default);
  app.use("/api/swarm-intelligence", (await import("./routes/swarm-intelligence.js")).default);
  app.use("/api/generative-art-and-music", (await import("./routes/generative-art-and-music.js")).default);
  // AI routes handled by tRPC

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));
  
  // Serve uploaded files
  const uploadsPath = path.resolve(process.cwd(), "uploads");
  app.use("/uploads", express.static(uploadsPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`✅ Server running on http://localhost:${port}/`);
    console.log(`✅ API available at http://localhost:${port}/api`);
    console.log(`✅ WebSocket server running on ws://localhost:${port}/ws`);
  });
}

startServer().catch(console.error);

