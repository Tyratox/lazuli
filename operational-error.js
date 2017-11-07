class OperationalError extends Error {
	constructor() {
		super();
		this.isOperational = true; //bluebird compatible
	}
}

module.exports = OperationalError;
