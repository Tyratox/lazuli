const {
	DB_NAME,
	DB_USERNAME,
	DB_PASSWORD,
	DB_HOST,
	DB_PORT,
	DB_DIALECT,
	DB_POOL_MIN,
	DB_POOL_MAX,
	DB_POOL_IDLE
} = require("lazuli-require")("lazuli-config");

const Sequelize = require("sequelize");
const { relay: { sequelizeNodeInterface } } = require("graphql-sequelize");

const valueFilter = require("./value-filter");
const eventEmitter = require("./event-emitter");
const logger = require("./logger");

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
let sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
	host: DB_HOST,
	port: DB_PORT,
	dialect: DB_DIALECT,
	pool: {
		max: DB_POOL_MAX,
		min: DB_POOL_MIN,
		idle: DB_POOL_IDLE
	},
	logging: false //s => logger.log("debug", s)
});

sequelize
	.authenticate()
	.then(() => {
		logger.log("info", "Connection has been established successfully.");
	})
	.catch(err => {
		logger.error("error", "Unable to connect to the database:");
		throw err;
	});

const { nodeInterface, nodeField, nodeTypeMapper } = sequelizeNodeInterface(
	sequelize
);

sequelize.nodeInterface = nodeInterface;
sequelize.nodeField = nodeField;
sequelize.nodeTypeMapper = nodeTypeMapper;

sequelize.attributeFieldsCache = {};

module.exports = sequelize;
