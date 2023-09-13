'use strict';

const bootstrap = require('./bootstrap');
const register = require('./register');
const destroy = require('./destroy');
const config = require('./config');
const controllers = require('./controllers');
const services = require('./services');
const routes = require('./routes');

module.exports = {
  bootstrap,
  register,
  destroy,
  config,
  controllers,
  services,
  routes,
};
