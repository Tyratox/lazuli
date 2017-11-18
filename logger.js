const path = require("path");

/**
 * Exports an instance of a {@link https://www.npmjs.com/package/winston winston}
 * logger that's globally accessible
 * @module lazuli-core/models/logger
 */

const { LOG_DIRECTORY } = require("lazuli-config");

const winston = require("winston");

winston.addColors({
	error: "red",
	warning: "yellow",
	violation: "red",
	info: "blue",
	debug: "magenta",
	sql: "cyan"
});

/**
 * The configured winston logger
 * @type {Logger}
 */

class LevelTransport extends winston.Transport {
	constructor(options) {
		super(options);

		this.name = (options && options.name) || "LeveLogger";
		this.level = (options && options.level) || "info";
		this.filename = (options && options.filename) || this.level + ".log";
		this.prettyPrint = (options && options.prettyPrint) || true;
		this.transportClass =
			(options && options.transportClass) || winston.transports.Console;
		this.handleExceptions = (options && options.handleExceptions) || false;

		this.fileLogger = new winston.Logger({
			transports: [
				new this.transportClass({
					name: this.name + "-file",
					level: this.level,
					filename: this.filename,
					colorize: true,
					prettyPrint: this.prettyPrint,
					handleExceptions: this.handleExceptions
				})
			],
			levels: {
				[this.level]: 0
			}
		});
	}

	log(level, message, meta, callback) {
		if (level === this.level) {
			this.fileLogger.log(level, message, meta);
		}
		callback(null, true);
	}
}

winston.transports.LevelTransport = LevelTransport;

const logger = new winston.Logger({
	transports: [
		new winston.transports.Console({
			name: "console",
			level: "info",
			colorize: true,
			prettyPrint: true
		}),
		new winston.transports.File({
			name: "file-warning",
			level: "warning",
			filename: path.join(LOG_DIRECTORY, "error.log"),
			prettyPrint: true
		}),
		new winston.transports.LevelTransport({
			name: "file-violation",
			level: "violation",
			filename: path.join(LOG_DIRECTORY, "violation.log"),
			transportClass: winston.transports.File
		})
	],
	levels: {
		error: 0,
		warning: 1,
		violation: 2,
		info: 3,
		debug: 4
	}
});

module.exports = logger;
