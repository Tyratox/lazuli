const path = require("path");

const { expressServer, httpServer } = require("../globals/http-server");

const valueFilter = require("../globals/value-filter");
const eventEmitter = require("../globals/events");
const sequelize = require("../globals/sequelize");

const { expressServer, httpServer } = initHttpServer(eventEmitter, valueFilter);

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

			sequelize.sync({
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
