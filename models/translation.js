const { STRING } = require("sequelize");

const eventEmitter = require("lazuli-core/event-emitter");
const valueFilter = require("lazuli-core/value-filter");
const sequelize = require("lazuli-core/sequelize");

/**
 * The translation sequelize module
 * @module lazuli-core/models/translation
 */

/**
 * The translation sequelize model
 * @class
 * @memberof module:lazuli-core/models/translation
 * 
 * @type {Translation}
 * @version 1.0
 * @since 1.0
 */
const Translation = sequelize.define("translation", {
	text: {
		type: STRING
	}
});

/**
 * Associates this model with others
 * @version 1.0
 * @since 1.0
 * 
 * @static
 * @public
 * 
 * @fires "core.model.translation.association"
 * 
 * @param {object} models The models to associate with
 * @param {module:lazuli-core/models/i18n.I18n} models.I18n The i18n model
 * @param {module:lazuli-core/models/locale.Locale} models.Locale The locale model
 * @return {promise<void>}
 */
Translation.associate = function({ I18n, Locale }) {
	/**
	 * The Translation - I18n relation
	 * @since 1.0
	 * @type {BelongsTo}
	 * @public
	 * @static
	 * @memberof module:lazuli-core/models/translation.Translation
	 */
	this.I18n = this.belongsTo(I18n, {
		as: "I18n",
		foreignKey: "i18nId",
		hooks: true
	});

	/**
	 * The Translation - Locale relation
	 * @since 1.0
	 * @type {BelongsTo}
	 * @public
	 * @static
	 * @memberof module:lazuli-core/models/translation.Translation
	 */
	this.Locale = this.belongsTo(Locale, {
		as: "Locale",
		foreignKey: "localeId",
		hooks: true
	});

	/**
     * Event that is fired after all internal associations have been created
	 * and additional ones can be added.
     *
     * @event "core.model.translation.association"
	 * @version 1.0
	 * @since 1.0
     * @type {object}
     * @property {module:lazuli-core/models/translation.Translation} Translation
     */
	return eventEmitter.emit("core.model.translation.association", {
		Translation: this
	});
};

module.exports = Translation;
