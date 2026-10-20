const crypto = require('crypto');
const { isSameOriginRequest, readBody, sendJson } = require('./helpers');
const { hasValidSession } = require('./session-auth');

const COOKIE_NAME = 'birthday_admin_session';
const SESSION_DURATION_SECONDS = 8 * 60 * 60;

function getSessionConfig() {
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;
  return password && secret ? { password, secret } : null;
}

function createSessionToken(secret) {
  const payload = Buffer.from(JSON.stringify({
    expiresAt: Date.now() + SESSION_DURATION_SECONDS * 1000,
  })).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

function setSessionCookie(req, res, value, maxAge) {
  const secure = process.env.NODE_ENV === 'production'
    || req.headers['x-forwarded-proto'] === 'https';
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure ? '; Secure' : ''}`);
}

function passwordMatches(input, expected) {
  const inputHash = crypto.createHash('sha256').update(input).digest();
  const expectedHash = crypto.createHash('sha256').update(expected).digest();
  return crypto.timingSafeEqual(inputHash, expectedHash);
}

module.exports = async function sessionApi(req, res) {
  const config = getSessionConfig();
  if (!config) {
    sendJson(res, 503, { error: 'Atur ADMIN_PASSWORD dan ADMIN_SESSION_SECRET pada environment server.' });
    return;
  }

  if (req.method === 'GET') {
    sendJson(res, 200, { authenticated: hasValidSession(req) });
    return;
  }

  if (req.method !== 'POST' && req.method !== 'DELETE') {
    res.setHeader('Allow', 'GET, POST, DELETE');
    sendJson(res, 405, { error: 'Metode permintaan tidak didukung.' });
    return;
  }

  if (!isSameOriginRequest(req)) {
    sendJson(res, 403, { error: 'Permintaan lintas origin tidak diizinkan.' });
    return;
  }

  if (req.method === 'DELETE') {
    setSessionCookie(req, res, '', 0);
    sendJson(res, 200, { authenticated: false });
    return;
  }

  let credentials;
  try {
    credentials = await readBody(req);
  } catch (error) {
    sendJson(res, error.statusCode || 400, { error: error.message });
    return;
  }

  const password = typeof credentials?.password === 'string' ? credentials.password : '';
  if (!passwordMatches(password, config.password)) {
    sendJson(res, 401, { error: 'Kata sandi admin salah.' });
    return;
  }

  setSessionCookie(req, res, createSessionToken(config.secret), SESSION_DURATION_SECONDS);
  sendJson(res, 200, { authenticated: true });
};
