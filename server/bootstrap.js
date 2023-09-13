const {errors} = require("@strapi/utils");

const { ValidationError } = errors;

module.exports = ({ strapi }) => {
  // bootstrap phase

  const localeSlugFields = {};

  Object.entries(strapi.contentTypes).forEach(
    ([key, value]) => {
      const { attributes } = value;
      if (typeof attributes === "object") {
        Object.entries(attributes).forEach(
          ([source, config]) => {
            const { customField, options } = config;
            if (customField === "plugin::locale-slug.locale-slug") {
              const { slugFieldName } = options;
              const model = attributes[slugFieldName];
              // --------------------------
              // TODO: add model vliadation
              // --------------------------
              const localeSlugField = { slugFieldName, model, source };

              localeSlugFields[key] = localeSlugFields[key]
                ? [...localeSlugFields[key], localeSlugField]
                : [localeSlugField];
            }
          }
        );
      }
    }
  );

  strapi.db.lifecycles.subscribe({
    models: Object.keys(localeSlugFields),
      beforeCreate(event) {
        const locale = event.params.data.locale;

        const configs = localeSlugFields[event.model.uid];
        configs.forEach(({ slugFieldName, source }) => {
          const sourceField = event.params.data[source];
          event.params.data[slugFieldName] = `${locale}_${sourceField}`;
        });
      },
      async beforeUpdate(event) {
        const id = event.params?.where?.id ?? null;
        const modelUid = event.model.uid;

        const configs = localeSlugFields[modelUid];

        for (const config of configs) {
          const { slugFieldName, source, name } = config;
          let sourceField = event.params.data[source];
          let uidField = event.params.data[slugFieldName];
          if (!uidField || !sourceField) {
            const entity = await strapi.service(modelUid).findOne(id);
            uidField = uidField ? uidField : entity[slugFieldName];
            sourceField = sourceField ? sourceField : entity[source];
          }

          if (!uidField) {
            throw new ValidationError(`locale-slug field ${name}, error: "${slugFieldName}" doesn't exists`)
          }
          const [locale] = uidField.split('_');

          event.params.data[slugFieldName] = `${locale}_${sourceField}`;
        }
      },
  });
};
