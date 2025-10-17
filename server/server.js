// server/server.js
import express from "express";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;

// Serve the static files from the 'current' directory, which is one level up from the server/ directory
const staticPath = path.resolve(process.cwd(), "../current");
console.log(`Serving static files from: ${staticPath}`);

app.use(express.static(staticPath));

// Handle SPA routing: send all other requests to index.html
app.get('*', (req, res) => {
  res.sendFile(path.resolve(staticPath, 'index.html'));
});

app.listen(PORT, () => console.log(`SAT18 Proxy active on port ${PORT}`));
