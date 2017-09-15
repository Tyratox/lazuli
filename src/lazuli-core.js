const path = require("path");

const initDatabase = require("./database");
const initHttpServer = require("./http-server");

const eventEmitter = new (require("promise-events"))();
const valueFilter = new (require("lazuli-require")("lazuli-filters"))();

const { expressServer, httpServer } = initHttpServer(eventEmitter, valueFilter);

const graphqlHTTP = require("express-graphql");

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

			this.sequelize.sync({
				force: true //for dev
			});

			return eventEmitter.emit("model.init.after");
		})
		.then(() => {
			return eventEmitter.emit("express.routing.rest", this.expressServer);
		})
		.then(() => {
			return eventEmitter.emit("express.routing.graphql.before");
		})
		.then(() => {
			this.expressServer.use(
				"/graphql",
				graphqlHTTP(request => {
					return {
						schema: new GraphQLSchema({
							query: new GraphQLObjectType({
								name: "RootQuery",
								fields: valueFilter.filterable(
									"graphql.schema.root.query.fields",
									{ node: this.sequelize.nodeField },
									this.sequelize,
									models
								)
							}),
							mutation: new GraphQLObjectType({
								name: "RootMutation",
								fields: valueFilter.filterable(
									"graphql.schema.root.mutation.fields",
									{},
									this.sequelize,
									models
								)
							})
						}),
						context: request,
						graphiql: true
					};
				})
			);
		})
		.then(() => {
			return eventEmitter.emit("express.routing.graphql.after");
		})
		.then(() => {
			return eventEmitter.emit("lazuli.init.after");
		})
		.catch(e => {
			console.log(e);
		});
};

module.exports = new Lazuli();
