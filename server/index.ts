import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

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

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Routes
  app.use("/api/auth", (await import("./routes/auth.js")).default);
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

