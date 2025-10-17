// server/ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "sat18-proxy",
      script: "server/server.js",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
};