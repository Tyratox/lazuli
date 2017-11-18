/**
 * Exports an error class called 'OperationalError'
 * Includes the 'isOperational' property in order to be compatible
 * with bluebird
 * @module lazuli-core/models/event-emitter
 */
class OperationalError extends Error {
	constructor(message, ...args) {
		super(message, ...args);
		this.isOperational = true; //bluebird compatible
	}
}

module.exports = OperationalError;
