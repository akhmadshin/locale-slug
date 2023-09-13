'use strict';

const {
  validateGenerateUIDInput,
  validateCheckUIDAvailabilityInput,
} = require('./validation');
const { getService } = require('../utils');

module.exports = ({ strapi })  => ({
  async create(ctx) {},

  async generateUID(ctx) {
    const uIDInputData = await validateGenerateUIDInput(ctx.request.body);
    const { contentTypeUID, field, data, fieldOperator } = uIDInputData;
    // await validateUIDField(contentTypeUID, field);

    const uidService = getService('uid');

    ctx.body = {
      data: await uidService.generateUIDField({ contentTypeUID, field, fieldOperator, data }),
    };
  },

  async checkUIDAvailability(ctx) {
    const { contentTypeUID, field, value, locale, entityId } = await validateCheckUIDAvailabilityInput(
      ctx.request.body
    );
    let localeOrDefaultLocale = locale;
    const localeStore = strapi.store({ type: 'plugin', name: 'i18n'});

    if (!locale) {
      localeOrDefaultLocale = await localeStore.get({ key: 'default_locale' });

    }

    const uidService = getService('uid');
    const isAvailable = await uidService.checkUIDAvailability({ contentTypeUID, field, value, locale: localeOrDefaultLocale, entityId });

    ctx.body = {
      isAvailable,
      suggestion: !isAvailable
        ? await uidService.findUniqueUID({ contentTypeUID, field, value })
        : null,
    };
  },
});

