const { STRING } = require("sequelize");

const eventEmitter = require("lazuli-core/event-emitter");
const valueFilter = require("lazuli-core/value-filter");
const sequelize = require("lazuli-core/sequelize");

/**
 * The i18n sequelize module
 * @module lazuli-core/models/i18n
 */

/**
 * The i18n sequelize model
 * @class
 * @memberof module:lazuli-core/models/i18n
 * 
 * @type {I18n}
 * @version 1.0
 * @since 1.0
 */
const I18n = sequelize.define("i18n"); //just an id

/**
 * Associates this model with others
 * @version 1.0
 * @since 1.0
 * 
 * @static
 * @public
 * 
 * @fires "core.model.i18n.association"
 * 
 * @param {object} models The models to associate with
 * @param {module:lazuli-core/models/translation.Translation} models.Translation The translation model
 * @return {promise<void>}
 */
I18n.associate = function({ Translation }) {
	/**
	 * The I18n - Translation relation
	 * @since 1.0
	 * @type {HasMany}
	 * @public
	 * @static
	 * @memberof module:lazuli-core/models/i18n.I18n
	 */
	this.Translations = this.hasMany(Translation, {
		as: "Translations",
		foreignKey: "i18nId",
		hooks: true
	});

	/**
     * Event that is fired after all internal associations have been created
	 * and additional ones can be added.
     *
     * @event "core.model.i18n.association"
	 * @version 1.0
	 * @since 1.0
     * @type {object}
     * @property {module:lazuli-core/models/i18n.I18n} I18n The i18n model
     */
	return eventEmitter.emit("core.model.i18n.association", {
		I18n: this
	});
};

module.exports = I18n;
