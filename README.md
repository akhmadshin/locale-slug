# Strapi plugin locale-slug

A plugin that lets you use slug field with i18n, by forcing your slug field to follow the template `${locale}_${code}`.

### Installation

```sh
yarn add locale-slug
```

```sh
yarn build
```

### Guide

1. Add custom field locale-slug to your collection type.
2. For name field you can set any you want (in my example it'll be `code`)
3. For Slug field enter name of existing slug field (in my case it'll be `slug`)
4. Go to advanced settings tab and disable localization
5. Optional. Configure the view to hide slug field

Now you have a field that will act like UID field (but it actually simple text field). On save it will modify your slug field to follow the template `${locale}_${code}`. 

### Warning
Don't try to search your entity by that field, it's bad for performance. Search by your original slug field.
