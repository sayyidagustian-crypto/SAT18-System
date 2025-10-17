// server/server.js
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import path from "path";

const app = express();

// Serve static build if needed (e.g., SPA build in ~/sat18-deploy/current)
app.use(express.static(path.resolve(process.cwd(), "../sat18-deploy/current")));

// Optional: proxy to internal service (adjust target if you have an API)
app.use(
  "/",
  createProxyMiddleware({
    target: "http://localhost:24700", // ganti jika Anda punya service internal
    changeOrigin: true,
    ws: true,
    // Jika hanya SPA statis, Anda bisa menonaktifkan proxy ini
  })
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`SAT18 Proxy aktif di port ${PORT}`));
