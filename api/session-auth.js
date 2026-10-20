const crypto = require('crypto');

const COOKIE_NAME = 'birthday_admin_session';

function hasValidSession(req) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    return false;
  }

  const cookieHeader = req.headers.cookie || '';
  const cookie = cookieHeader.split(';').map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE_NAME}=`));
  if (!cookie) {
    return false;
  }

  const [payload, signature] = cookie.slice(COOKIE_NAME.length + 1).split('.');
  if (!payload || !signature) {
    return false;
  }

  const expected = crypto.createHmac('sha256', secret).update(payload).digest();
  let received;
  try {
    received = Buffer.from(signature, 'base64url');
  } catch {
    return false;
  }
  if (received.length !== expected.length || !crypto.timingSafeEqual(received, expected)) {
    return false;
  }

  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return Number.isFinite(session.expiresAt) && session.expiresAt > Date.now();
  } catch {
    return false;
  }
}

module.exports = { hasValidSession };
