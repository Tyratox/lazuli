const { STRING } = require("sequelize");

const { CSRF_TOKEN_LIFETIME } = require("lazuli-config");

const eventEmitter = require("lazuli-core/event-emitter");
const valueFilter = require("lazuli-core/value-filter");
const sequelize = require("lazuli-core/sequelize");

const OperationalError = require("../operational-error");

const {
	generateRandomString,
	generateHash
} = require("../utilities/crypto.js");

/**
 * The csrf token sequelize module
 * @module lazuli-core/models/csrf-token
 */

/**
 * The csrf token sequelize model
 * @class
 * @memberof module:lazuli-core/models/csrf-token
 * 
 * @type {CsrfToken}
 * @version 1.0
 * @since 1.0
 */
const CsrfToken = sequelize.define("csrf-token", {
	hash: {
		type: STRING,
		unique: true
	},
	expires: {
		type: DATE
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
 * @fires "core.model.csrf-token.association"
 * 
 * @param {object} models The models to associate with
 * @param {UserModel} models.User A user model
 * @return {promise<void>}
 */
CsrfToken.associate = function({ User }) {
	/**
	 * The CSRF Token - User relation
	 * @since 1.0
	 * @type {BelongsTo}
	 * @public
	 * @static
	 * @memberof module:lazuli-core/models/csrf-token.CsrfToken
	 */
	this.Users = this.belongsTo(User, {
		as: "Users",
		foreignKey: "userId",
		hooks: true
	});

	/**
     * Event that is fired after all internal associations have been created
	 * and additional ones can be added.
     *
     * @event "core.model.csrf-token.association"
	 * @version 1.0
	 * @since 1.0
     * @type {object}
     * @property {module:lazuli-core/models/csrf-token.CsrfToken} CsrfToken The csrf token model
     */
	return eventEmitter.emit("core.model.csrf-token.association", {
		CsrfToken: this
	});
};

/**
 * Generates a csrf token
 * @version 1.0
 * @since 1.0
 * 
 * @public
 * @static
 * 
 * @param {number} userId The user id to associate the new token with
 * @return {promise<object>} A promise that will return the generated token and the model
 */
CsrfToken.generateToken = function(userId) {
	const token = generateRandomString(TOKEN_LENGTH * 2);

	return this.findByToken(token).then(tokenModel => {
		if (tokenModel) {
			return this.generateToken(userId);
		} else {
			return this.create({
				hash: this.hashToken(token),
				expires: Date.now() + CSRF_TOKEN_LIFETIME * 1000,
				userId
			}).then(model => {
				return Promise.resolve({ model, token });
			});
		}
	});
};

/**
 * Hashes a token (without) a salt
 * @version 1.0
 * @since 1.0
 * 
 * @public
 * @static
 * 
 * @param  {string} token The token to hash
 * @return {string} The generated hash
 */
OauthAccessToken.hashToken = function(token) {
	return generateHash(token, false, HASH_ALGORITHM).hash;
};

/**
 * Tries to find the database model based on the passed token
 * @version 1.0
 * @since 1.0
 * 
 * @public
 * @static
 * 
 * @param {string} token The received csrf token
 * @param {number} userId The user id to check for
 * @return {promise} Whether the token could be verified
 */
OauthAccessToken.verifyToken = function(token, userId) {
	return this.findOne({
		where: { hash: this.hashToken(token), UserId }
	}).then(model => {
		if (model) {
			return model.destory().then(() => Promise.resolve());
		} else {
			Promise.reject(new OperationalError("The csrf token did't match"));
		}
	});
};

module.exports = CsrfToken;
