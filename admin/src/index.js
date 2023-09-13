import { prefixPluginTranslations } from "@strapi/helper-plugin";

import pluginPkg from "../../package.json";
import pluginId from "./pluginId";
import PluginIcon from "./components/PluginIcon";

const name = pluginPkg.strapi.name;

export default {
  register(app) {
    app.customFields.register({
      name: name,
      pluginId: pluginId,
      type: "string",
      icon: PluginIcon,
      intlLabel: {
        id: "locale-slug.label",
        defaultMessage: "locale-slug",
      },
      intlDescription: {
        id: "locale-slug.description",
        defaultMessage: "locale-slug",
      },
      options: {
        base: [
          {
            sectionTitle: {
              id: "locale-slug.slugField.title",
              defaultMessage: "Slug field",
            },
            items: [
              {
                intlLabel: {
                  id: "locale-slug.slugField.label",
                  defaultMessage: "Slug field",
                },
                description: {
                  id: "locale-slug.uid.label.description",
                  defaultMessage:
                    "Name of slug field",
                },
                name: "options.slugFieldName",
                type: "text",
                value: "",
              },
            ],
          },
          {
            sectionTitle: {
              id: "relation-plus.options.title",
              defaultMessage: "Options",
            },
            items: [
              {
                intlLabel: {
                  id: "form.attribute.item.privateField",
                  defaultMessage: "Private field",
                },
                description: {
                  id: "form.attribute.item.privateField.description",
                  defaultMessage:
                    "This field will not show up in the API response",
                },
                name: "private",
                type: "checkbox",
                value: true,
              },
            ],
          },
        ],
        advanced: [],
      },
      components: {
        Input: async () =>
          import(
            /* webpackChunkName: "input-component" */ "./components/LocaleSlug"
            ),
      },
    });
  },

  bootstrap(app) {
    app.registerHook(
      'Admin/CM/pages/ListView/inject-column-in-table',
      ({ displayedHeaders, layout }) => {
        return { displayedHeaders, layout };
      }
    )
  },

  async registerTrads(app) {
    const { locales } = app;

    const importedTrads = await Promise.all(
      (locales).map((locale) => {
      return import(`./translations/${locale}.json`)
        .then(({ default: data }) => {
          return {
            data: prefixPluginTranslations(data, pluginId),
            locale,
          };
        })
        .catch(() => {
          return {
            data: {},
            locale,
          };
        });
    })
  );

    return Promise.resolve(importedTrads);
  },
};
