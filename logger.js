/**
 * Exports an instance of a {@link https://www.npmjs.com/package/winston winston}
 * logger that's globally accessible
 * @module lazuli-core/models/logger
 */

const { LOG_FILE } = require("lazuli-config");

const winston = require("winston");

winston.addColors({
	critical: "red",
	error: "red",
	warning: "yellow",
	info: "blue",
	debug: "magenta"
});

/**
 * The configured winston logger
 * @type {Logger}
 */
const logger = new winston.Logger({
	transports: [
		new winston.transports.Console({
			name: "console",
			level: "info",
			colorize: true,
			prettyPrint: true
		}),
		new winston.transports.File({
			name: "file",
			level: "debug",
			filename: LOG_FILE,
			handleExceptions: true,
			colorize: false,
			prettyPrint: true
		})
	],
	levels: {
		critical: 0,
		error: 1,
		warning: 2,
		info: 3,
		debug: 4
	}
});

module.exports = logger;
