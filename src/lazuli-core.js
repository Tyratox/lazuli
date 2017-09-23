const path = require("path");

const { expressServer, httpServer } = require("../globals/http-server");
const valueFilter = require("../globals/value-filter");
const eventEmitter = require("../globals/event-emitter");
const sequelize = require("../globals/sequelize");

const { GraphQLSchema, GraphQLObjectType } = require("graphql");
const graphqlHTTP = require("express-graphql");

/**
 * The lazuli class
 * @type {Lazuli}
 */
class Lazuli {
	constructor() {}
}

/**
 * Initiates the lazuli object
 * @return {Promise}
 */
Lazuli.prototype.init = function() {
	let models;

	return eventEmitter
		.emit("lazuli.init.before")
		.then(() => {
			return eventEmitter.emit("express.init.after", expressServer);
		})
		.then(() => {
			return eventEmitter.emit("model.init.before");
		})
		.then(() => {
			models = valueFilter.filterable("sequelize.models", {}, sequelize);
			return eventEmitter.emit("model.association", models);
		})
		.then(() => {
			let types = {};
			Object.values(models).forEach(model => {
				if (model.graphQlType) {
					types[model.name] = model.graphQlType;
				}
			});
			sequelize.nodeTypeMapper.mapTypes(types);

			return sequelize.sync({
				force: true //for dev
			});
		})
		.then(() => {
			return eventEmitter.emit("model.init.after");
		})
		.then(() => {
			return eventEmitter.emit("express.routing.rest", expressServer);
		})
		.then(() => {
			return eventEmitter.emit("express.routing.graphql.before");
		})
		.then(() => {
			const schema = new GraphQLSchema({
				query: new GraphQLObjectType({
					name: "RootQuery",
					fields: valueFilter.filterable(
						"graphql.schema.root.query.fields",
						{ node: sequelize.nodeField },
						sequelize,
						models
					)
				}),
				mutation: new GraphQLObjectType({
					name: "RootMutation",
					fields: valueFilter.filterable(
						"graphql.schema.root.mutation.fields",
						{},
						sequelize,
						models
					)
				})
			});

			expressServer.use(
				"/graphql",
				(request, response, next) => {
					const middlewares = valueFilter.filterable(
						"graphql.middleware.before",
						[]
					);
					const loop = (iterator = 0) => {
						if (iterator < middlewares.length) {
							middlewares[iterator](request, response, () => {
								loop(iterator + 1);
							});
						} else {
							next();
						}
					};

					loop();
				},
				graphqlHTTP(request => {
					return {
						schema,
						context: { request },
						//TEMP dev
						graphiql: true,
						formatError: error => ({
							message: error.message,
							details: error.stack
						})
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
