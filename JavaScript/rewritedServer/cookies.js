'use strict';

const { logger } = require('./loger');

const parseCookies = (req) => {
  const cookie = req.headers.cookie;
  logger.cookie(cookie);
  const cookies = {};
  if (cookie) cookie.split(';').forEach((item) => {
    const parts = item.split('=');
    cookies[(parts[0]).trim()] = (parts[1] || '').trim();
  });
  return cookies;
}

module.exports = {
  parseCookies
}
