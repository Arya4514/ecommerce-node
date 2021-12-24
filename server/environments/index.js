const path = require('path');

const ENV = process.env.NODE_ENV || 'development';
// const ENV = 'production';

const envConfig = require(path.join(__dirname, ENV));

const config = Object.assign({
  [ENV]: true,
  env: ENV
}, envConfig);

module.exports = config;