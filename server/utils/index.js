'use strict';

// retrieve a local service
const getService = (name) => {
  return strapi.plugin('locale-slug').service(name);
};

module.exports = {
  getService,
};
