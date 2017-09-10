const path = require("path");

const initDatabase = require("./database");
const initHttpServer = require("./http-server");

const eventEmitter = new (require("promise-events"))();
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
	let models;

	eventEmitter
		.emit("lazuli.init.before")
		.then(() => {
			return eventEmitter.emit("model.init.before");
		})
		.then(() => {
			models = valueFilter.filterable("sequelize.models", {}, this.sequelize);
			return eventEmitter.emit("model.association", models);
		})
		.then(() => {
			let types = {};
			Object.values(models).forEach(model => {
				if (model.graphQlType) {
					types[model.name] = model.graphQlType;
				}
			});
			this.sequelize.nodeTypeMapper.mapTypes(types);
			return eventEmitter.emit("model.init.after");
		})
		.then(() => {
			return eventEmitter.emit("express.routing.rest", this.expressServer);
		})
		.then(() => {
			return eventEmitter.emit("express.routing.graphql", this.expressServer);
		})
		.then(() => {
			return eventEmitter.emit("lazuli.init.after");
		})
		.catch(e => {
			console.log(e);
		});
};

module.exports = new Lazuli();
