'use strict';

const pluginPkg =  require('../package.json');

module.exports = ({ strapi }) => {
	return strapi.customFields.register({
		name: pluginPkg.strapi.name,
		plugin: pluginPkg.strapi.name,
		type: "string",
	});

};
