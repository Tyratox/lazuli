const { STRING } = require("sequelize");

const eventEmitter = require("lazuli-core/event-emitter");
const valueFilter = require("lazuli-core/value-filter");
const sequelize = require("lazuli-core/sequelize");

/**
 * The locale sequelize module
 * @module lazuli-core/models/locale
 */

/**
 * The locale sequelize model
 * @class
 * @memberof module:lazuli-core/models/locale
 * 
 * @type {Locale}
 * @version 1.0
 * @since 1.0
 */
const Locale = sequelize.define("locale", {
	name: {
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
 * @fires "core.model.locale.association"
 * 
 * @param {object} models The models to associate with
 * @param {module:lazuli-core/models/translation.Translation} models.Translation The translation model
 * @param {module:lazuli-core/models/currency.Currency} models.Currency The currency model
 * @return {promise<void>}
 */
Locale.associate = function({ Translation, Currency }) {
	/**
	 * The Locale - translation relation
	 * @since 1.0
	 * @type {BelongsTo}
	 * @public
	 * @static
	 * @memberof module:lazuli-core/models/locale.Locale
	 */
	this.Translations = this.hasMany(Translation, {
		as: "Translations",
		foreignKey: "translationId",
		hooks: true
	});

	/**
	 * The Locale - Currency relation
	 * @since 1.0
	 * @type {BelongsTo}
	 * @public
	 * @static
	 * @memberof module:lazuli-core/models/locale.Locale
	 */
	this.Currency = this.belongsTo(Curreny, {
		as: "Currency",
		foreignKey: "currencyId",
		hooks: true
	});

	/**
     * Event that is fired after all internal associations have been created
	 * and additional ones can be added.
     *
     * @event "core.model.locale.association"
	 * @version 1.0
	 * @since 1.0
     * @type {object}
     * @property {module:lazuli-core/models/locale.Locale} Locale
     */
	return eventEmitter.emit("core.model.locale.association", {
		Locale: this
	});
};

module.exports = Locale;
