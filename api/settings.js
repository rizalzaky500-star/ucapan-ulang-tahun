const { getSettings, saveSettings } = require('../database');
const { isSameOriginRequest, readBody, sendJson } = require('./helpers');
const { hasValidSession } = require('./session-auth');

module.exports = async function settingsApi(req, res) {
  if (req.method === 'GET') {
    try {
      sendJson(res, 200, await getSettings());
    } catch (error) {
      console.error('Gagal membaca pengaturan ulang tahun:', error);
      sendJson(res, 500, { error: 'Pengaturan tidak dapat dibaca dari database.' });
    }
    return;
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    sendJson(res, 405, { error: 'Metode permintaan tidak didukung.' });
    return;
  }

  if (!isSameOriginRequest(req)) {
    sendJson(res, 403, { error: 'Permintaan lintas origin tidak diizinkan.' });
    return;
  }

  if (!hasValidSession(req)) {
    sendJson(res, 401, { error: 'Silakan masuk sebagai admin untuk menyimpan pengaturan.' });
    return;
  }

  let settings;
  try {
    settings = await readBody(req);
  } catch (error) {
    sendJson(res, error.statusCode || 400, { error: error.message });
    return;
  }

  const name = typeof settings?.name === 'string' ? settings.name.trim() : '';
  const age = Number(settings?.age);
  if (!name || name.length > 100 || !Number.isInteger(age) || age < 1 || age > 150) {
    sendJson(res, 400, { error: 'Masukkan nama (maksimal 100 karakter) dan umur yang valid (1–150 tahun).' });
    return;
  }

  try {
    sendJson(res, 200, await saveSettings({ name, age }));
  } catch (error) {
    console.error('Gagal menyimpan pengaturan ulang tahun:', error);
    sendJson(res, 500, { error: 'Pengaturan tidak dapat disimpan ke database.' });
  }
};
