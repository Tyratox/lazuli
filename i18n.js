/**
 * Exports an instance of {@link https://www.npmjs.com/package/i18n i18n}
 * that's globally accessible
 * @module lazuli-core/models/i18n
 */

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
