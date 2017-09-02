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

module.exports = (eventEmitter, valueFilter) => {
	return new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
		host: DB_HOST,
		port: DB_PORT,
		dialect: DB_DIALECT,
		pool: {
			max: 5,
			min: 0,
			idle: 10000
		},
		dialectOptions: {
			charset: "utf8mb4"
		},
		logging: null
	});
};
