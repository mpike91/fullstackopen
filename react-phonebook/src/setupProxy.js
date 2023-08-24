const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api", // The path you want to proxy (e.g., requests to /api/* will be proxied)
    createProxyMiddleware({
      target: "http://localhost:3001", // URL of your backend server
      changeOrigin: true,
    })
  );
};
