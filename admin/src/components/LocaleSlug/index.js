import { GridItem } from "@strapi/design-system";
import { useCMEditViewDataManager } from "@strapi/helper-plugin";
import React, {memo} from "react";

import isEqual from "lodash/isEqual";
import connect from "../../utils/connect";
import select from "../../utils/select";
import InputUID from "../InputUID";

const LocaleSlug = (props) => {
  const {
    value,
    onChange,
    contentTypeUID,
    name,
    attribute: {options : { slugFieldName }},
  } = props;

  const cMEditViewDataManager = useCMEditViewDataManager();
  const slugField = cMEditViewDataManager.layout.attributes[slugFieldName];

  if (!slugField) {
    console.error(`LOCALE_SLUG_ERROR: Slug field "${slugFieldName}" doesn't exists`)
    return <></>
  }

  return (
    <GridItem>
      <InputUID
        attribute={{
          "targetField": slugField.targetField,
          "pluginOptions": {
            i18n: { localized: false }
          }
        }}
        contentTypeUID={contentTypeUID}
        intlLabel={{
          "id": name,
          "defaultMessage": name
        }}
        name={name}
        slugFieldName={slugFieldName}
        onChange={onChange}
        value={value}
      />
    </GridItem>
  );
};

const Memoized = memo(LocaleSlug, isEqual);

export default connect(Memoized, select);
