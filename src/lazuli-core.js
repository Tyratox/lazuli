const path = require("path");

const initDatabase = require("./database");
const initHttpServer = require("./http-server");

const eventEmitter = new (require("events"))();
const valueFilter = new (require("lazuli-require")("lazuli-filters"))();

const { expressServer, httpServer } = initHttpServer(eventEmitter, valueFilter);

/**
 * The lazuli class
 * @type {Lazuli}
 */
class Lazuli {
	constructor() {}
}
/**
 * The global event emitter
 * @type {EventEmitter}
 */
Lazuli.prototype.eventEmitter = eventEmitter;

/**
 * The global value filter
 * @type {ValueFilter}
 */
Lazuli.prototype.valueFilter = valueFilter;

/**
 * The global sequelize object
 * @type {Object}
 */
Lazuli.prototype.sequelize = initDatabase(eventEmitter, valueFilter);
/**
 * The global express server
 * @type {Object}
 */
Lazuli.prototype.expressServer = expressServer;

/**
 * The global http server object
 * @type {Object}
 */
Lazuli.prototype.httpServer = httpServer;

/**
 * Initiates the lazuli object
 * @return {void}
 */
Lazuli.prototype.init = function() {
	eventEmitter.emit("lazuli.init.before");

	eventEmitter.emit("model.init.before");
	const models = valueFilter.filterable("sequelize.models", [], sequelize);
	models.forEach(model => {
		if (model.associate) {
			model.associate(models);
		}
	});
	eventEmitter.emit("model.init.after");

	eventEmitter.emit("express.routing.rest", this.expressServer);
	eventEmitter.emit("express.routing.graphql", this.expressServer);

	eventEmitter.emit("lazuli.init.after");
};

module.exports = new Lazuli();
