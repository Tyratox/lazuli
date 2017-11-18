const { STRING } = require("sequelize");

const eventEmitter = require("lazuli-core/event-emitter");
const valueFilter = require("lazuli-core/value-filter");
const sequelize = require("lazuli-core/sequelize");

/**
 * The currency sequelize module
 * @module lazuli-core/models/currency
 */

/**
 * The currency sequelize model
 * @class
 * @memberof module:lazuli-core/models/currency
 * 
 * @type {Currency}
 * @version 1.0
 * @since 1.0
 */
const Currency = sequelize.define("currency", {
	name: {
		type: STRING
	},
	sign: {
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
 * @fires "core.model.currency.association"
 * 
 * @param {object} models The models to associate with
 * @param {module:lazuli-core/models/locale.Locale} models.Locale The locale model
 * @return {promise<void>}
 */
Currency.associate = function({ Locale }) {
	/**
	 * The Locale - translation relation
	 * @since 1.0
	 * @type {HasMany}
	 * @public
	 * @static
	 * @memberof module:lazuli-core/models/currency.Currency
	 */
	this.Locales = this.hasMany(Locale, {
		as: "Locales",
		foreignKey: "currencyId",
		hooks: true
	});

	/**
     * Event that is fired after all internal associations have been created
	 * and additional ones can be added.
     *
     * @event "core.model.currency.association"
	 * @version 1.0
	 * @since 1.0
     * @type {object}
     * @property {module:lazuli-core/models/currency.Currency} Currency
     */
	return eventEmitter.emit("core.model.currency.association", {
		Currency: this
	});
};

module.exports = Currency;
