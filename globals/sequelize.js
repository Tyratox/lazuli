const logger = require("lazuli-require")("lazuli-logger");

const {
	DB_NAME,
	DB_USERNAME,
	DB_PASSWORD,
	DB_HOST,
	DB_PORT,
	DB_DIALECT
} = require("lazuli-require")("lazuli-config");

const Sequelize = require("sequelize");
const { relay: { sequelizeNodeInterface } } = require("graphql-sequelize");

const valueFilter = require("./value-filter");
const eventEmitter = require("./event-emitter");

//

if (DB_HOST && DB_PORT && DB_NAME && DB_USERNAME && DB_PASSWORD && DB_DIALECT) {
	logger.log(
		"info",
		"Connecting to database: " +
			DB_USERNAME +
			"@" +
			DB_HOST +
			":" +
			DB_PORT +
			" (" +
			DB_DIALECT +
			")"
	);
	let sequelize = new Sequelize(
		DB_NAME,
		DB_USERNAME,
		DB_PASSWORD,
		valueFilter.filterable("sequelize.options", {
			host: DB_HOST,
			port: DB_PORT,
			dialect: DB_DIALECT,
			pool: {
				max: 5,
				min: 1,
				idle: 10000
			},
			dialectOptions: {
				charset: "utf8mb4"
			}
		})
	);

	const { nodeInterface, nodeField, nodeTypeMapper } = sequelizeNodeInterface(
		sequelize
	);

	sequelize.nodeInterface = nodeInterface;
	sequelize.nodeField = nodeField;
	sequelize.nodeTypeMapper = nodeTypeMapper;

	sequelize.attributeFieldsCache = {};

	return sequelize;
} else {
	logger.log("error", "Please define all required db fields");
	process.exit(1);
}
