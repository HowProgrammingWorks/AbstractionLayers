'use strict';

const { defaultController, personGetController, personPostController } = require('./controllers');

module.exports = {
  GET: {
    '/': defaultController,
    '/person': personGetController
  },
  POST: {
    '/person': personPostController
  }
};
