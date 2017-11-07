class OperationalError extends Error {
	constructor(message, ...args) {
		super(message, ...args);
		this.isOperational = true; //bluebird compatible
	}
}

module.exports = OperationalError;
