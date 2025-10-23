module.exports = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "es"],
  },
  fallbackLng: {
    default: ["en"],
  },
  debug: false,
  reloadOnPrerender: process.env.NODE_ENV === "development",
};
