const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
require('dotenv').config();

const settingsApi = require('./api/settings');
const sessionApi = require('./api/session');

const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';
const DIST_DIR = path.join(__dirname, 'dist');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.mpeg': 'audio/mpeg',
  '.wav': 'audio/wav',
};

function getNetworkAddresses() {
  const interfaces = os.networkInterfaces();
  const addresses = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        addresses.push(iface.address);
      }
    }
  }
  return addresses;
}

const server = http.createServer((req, res) => {
  // Parse URL pathname (remove query string & hash)
  const safeUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(safeUrl.pathname);

  if (pathname === '/api/settings') {
    settingsApi(req, res);
    return;
  }

  if (pathname === '/api/session') {
    sessionApi(req, res);
    return;
  }

  // Default routes
  if (pathname === '/' || pathname === '/index.html') {
    pathname = '/halaman.html';
  }

  // Sanitize path against directory traversal
  const safePath = path.resolve(DIST_DIR, `.${pathname}`);
  if (!safePath.startsWith(`${DIST_DIR}${path.sep}`)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(safePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <!DOCTYPE html>
        <html lang="id">
        <head><meta charset="UTF-8"><title>404 - Tidak Ditemukan</title></head>
        <body style="font-family: sans-serif; text-align: center; padding: 50px;">
          <h1>404 - Halaman Tidak Ditemukan</h1>
          <p><a href="/halaman.html">Kembali ke Halaman Utama</a></p>
        </body>
        </html>
      `);
      return;
    }

    const ext = path.extname(safePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
    });

    const stream = fs.createReadStream(safePath);
    stream.pipe(res);
  });
});

server.listen(PORT, HOST, () => {
  const networks = getNetworkAddresses();
  console.log('\n===========================================');
  console.log('🎉 Server Ulang Tahun Berjalan!');
  console.log('===========================================');
  console.log(`- Local:   http://localhost:${PORT}/`);
  if (networks.length > 0) {
    networks.forEach((ip) => {
      console.log(`- Network: http://${ip}:${PORT}/`);
    });
  } else {
    console.log(`- Network: http://(cek IP komputer Anda):${PORT}/`);
  }
  console.log('===========================================\n');
  console.log('Tekan Ctrl+C untuk menghentikan server.\n');
});
