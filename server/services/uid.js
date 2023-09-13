'use strict';

const { errors } = require('@strapi/utils');
const { ApplicationError } = errors;

const _ = require('lodash');
const slugify = require('@sindresorhus/slugify');

module.exports = ({ strapi }) => ({
  async generateUIDField({ contentTypeUID, field, fieldOperator, data }) {
    const contentType = strapi.contentTypes[contentTypeUID];
    const { attributes } = contentType;

    const { targetField, default: defaultValue, options } = attributes[field];
    const targetValue = _.get(data, targetField);

    if (!_.isEmpty(targetValue)) {
      return this.findUniqueUID({
        contentTypeUID,
        field: fieldOperator,
        value: slugify(targetValue, options),
      });
    }

    return this.findUniqueUID({
      contentTypeUID,
      field: fieldOperator,
      value: slugify(defaultValue || contentType.modelName, options),
    });
  },

  async findUniqueUID({ contentTypeUID, field, value }) {
    const query = strapi.db.query(contentTypeUID);

    const possibleColisions = await query
      .findMany({
        where: { [field]: { $contains: value } },
      })
      .then((results) => results.map((result) => result[field]));

    if (possibleColisions.length === 0) {
      return value;
    }

    let i = 1;
    let tmpUId = `${value}-${i}`;
    while (possibleColisions.includes(tmpUId)) {
      i += 1;
      tmpUId = `${value}-${i}`;
    }

    return tmpUId;
  },

  async checkUIDAvailability({ contentTypeUID, field, value, entityId }) {
    let entities = await strapi.entityService.findMany(contentTypeUID, {
      filters: { [field]: value },
      populate: {
        localizations: {
          fields: ['id']
        }
      },
      fields: ['id', 'code'],
    });
    const duplicateIds = [];
    const firstlyFoundDocument = entities.reduce((acc, entity) => {
      const relatedIds = entity.localizations.map((entity) => entity.id);
      const entityIds = [entity.id, ...relatedIds];

      if (acc.size && !acc.has(entity.id)) {
        duplicateIds.push(entityIds);
        return acc;
      }
      acc = new Set([...acc, ...entityIds]);
      return acc;
    }, new Set());

    if (duplicateIds.length) {
      throw new ApplicationError(`LOCALE_SLUG_ERROR: Field "${field}", Document[${Array.from(firstlyFoundDocument).join(',')}] have duplicates with documents: ${duplicateIds.map((duplicate) => `[${duplicate.join(',')}]`).join(', ')}`);
      return false;
    }

    if (firstlyFoundDocument.size > 0) {
      if (entityId) {
        return firstlyFoundDocument.has(entityId);
      }
      return false;
    }
    return true;
  },
});
