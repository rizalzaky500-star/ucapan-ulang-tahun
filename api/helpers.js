function sendJson(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(data));
}

function readBody(req) {
  if (req.body !== undefined) {
    if (typeof req.body === 'string') {
      return Promise.resolve(JSON.parse(req.body));
    }
    return Promise.resolve(req.body);
  }

  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    let tooLarge = false;

    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > 10_000) {
        tooLarge = true;
        return;
      }
      chunks.push(chunk);
    });

    req.on('end', () => {
      if (tooLarge) {
        reject(Object.assign(new Error('Ukuran permintaan terlalu besar.'), { statusCode: 413 }));
        return;
      }
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
      } catch {
        reject(Object.assign(new Error('Format JSON tidak valid.'), { statusCode: 400 }));
      }
    });

    req.on('error', reject);
  });
}

function isSameOriginRequest(req) {
  const origin = req.headers.origin;
  const host = req.headers.host;
  if (!origin || !host) {
    return false;
  }

  try {
    const originUrl = new URL(origin);
    return (originUrl.protocol === 'http:' || originUrl.protocol === 'https:')
      && originUrl.host.toLowerCase() === host.toLowerCase();
  } catch {
    return false;
  }
}

module.exports = { isSameOriginRequest, readBody, sendJson };
