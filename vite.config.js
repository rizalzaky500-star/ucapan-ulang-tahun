const path = require('path');
const { defineConfig } = require('vite');
require('dotenv').config();

const apiHandlers = {
  '/api/settings': require('./api/settings'),
  '/api/session': require('./api/session'),
};

function applicationMiddleware(server) {
  server.middlewares.use((req, res, next) => {
    const pathname = new URL(req.url, 'http://localhost').pathname;
    const handler = apiHandlers[pathname];
    if (handler) {
      handler(req, res);
      return;
    }

    if (pathname === '/') {
      res.statusCode = 302;
      res.setHeader('Location', '/halaman.html');
      res.end();
      return;
    }

    next();
  });
}

module.exports = defineConfig({
  plugins: [{
    name: 'birthday-app-server',
    configureServer: applicationMiddleware,
    configurePreviewServer: applicationMiddleware,
  }],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'halaman.html'),
        admin: path.resolve(__dirname, 'admin.html'),
      },
    },
  },
});
