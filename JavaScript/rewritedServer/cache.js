'use strict';

const cache = {};

const setCache = (url, cacheData) => {
  cache[url] = cacheData;
}

const getFromCache = (url) => {
  return cache[url];
}

module.exports = {
  setCache,
  getFromCache
}
