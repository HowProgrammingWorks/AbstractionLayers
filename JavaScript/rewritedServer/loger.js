'use strict';

class Logger {
  constructor(logColor = '\x1b[42m', errorColor = '\x1b[41m', cookieColor = '\x1b[45m') {
    this.logColor = logColor;
    this.errorColor = errorColor;
    this.cookieColor = cookieColor;
  }

  setDefaultColor() {
    console.log('\x1b[0m');
  }

  log(...messages) {
    console.log(`${this.logColor}${new Date().toISOString()} : ${messages.join(' ')}`);
    this.setDefaultColor();
  }

  error(...messages) {
    console.log(`${this.errorColor}${new Date().toISOString()} : ${messages.join(' ')}`);
    this.setDefaultColor();
  }

  cookie(cookie) {
    console.log(`${this.cookieColor}${cookie}`);
    this.setDefaultColor();
  }
}

const logger = new Logger();

module.exports = {
  logger
}
