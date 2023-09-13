module.exports = {
  type: "admin",
  routes: [
    {
      method: "POST",
      path: "/",
      handler: "locale-slug.create",
    },

    {
      method: 'POST',
      path: '/generate',
      handler: 'locale-slug.generateUID',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/check-availability',
      handler: 'locale-slug.checkUIDAvailability',
      config: {
        policies: [],
      },
    },
  ],
};
