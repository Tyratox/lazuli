const { LOCALE_PATH, LOCALES } = require("lazuli-config");

/**
 * The configured i18n object
 * @type {object}
 */
const i18n = require("i18n");

i18n.configure({
	locales: LOCALES,
	defaultLocale: LOCALES[0],
	directory: LOCALE_PATH,
	autoReload: true,
	extension: ".json",
	prefix: ""
});

module.exports = i18n;
