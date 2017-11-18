/**
 * Exports an instance of an {@link https://www.npmjs.com/package/express express}
 * server that's globally accessible
 * @module lazuli-core/models/express
 */

const express = require("express");
const expressSession = require("express-session");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const compression = require("compression");

const i18n = require("./i18n");

const {
	HTTP_PORT,
	SESSION_SECRET,
	MAX_HTTP_BODY_SIZE
} = require("lazuli-config");

const sequelize = require("./sequelize");
const valueFilter = require("./value-filter");
const eventEmitter = require("./event-emitter");
const logger = require("./logger");

logger.log("info", "Starting express server");

const expressServer = new express();

const httpServer = expressServer.listen(HTTP_PORT, "0.0.0.0", () => {
	logger.log(
		"info",
		"Server running on",
		"http://" + httpServer.address().address + ":" + httpServer.address().port
	);
});

httpServer.on("express.stop", httpServer.close);

logger.log("info", "Enabling express helmet.dnsPrefetchControl()");
expressServer.use(helmet.dnsPrefetchControl());

logger.log("info", "Enabling helmet.ieNoOpen()");
expressServer.use(helmet.ieNoOpen());

logger.log("info", "Enabling helmet.noCache()");
expressServer.use(helmet.noCache());

logger.log("info", "Disabling 'X-Powered-By'");
expressServer.disable("X-Powered-By");

logger.log("info", "Setting 'Content-Security-Policy'");
logger.log("info", "Setting 'Referrer-Policy' to 'no-referrer'");
logger.log("info", "Setting 'X-Frame-Options' to 'DENY'");
logger.log("info", "Setting 'X-XSS-Protection' to '1; report=/report'");
logger.log(
	"info",
	"Setting 'Strict-Transport-Security' to 'max-age=31536000; includeSubDomains'"
);
logger.log("info", "Setting 'X-Permitted-Cross-Domain-Policies' to 'none'");
logger.log(
	"info",
	"Setting 'Expect-CT' to 'max-age=86400, enforce, report-uri=\"/report\"'"
);

expressServer.use((request, response, next) => {
	response.header(
		"Content-Security-Policy",
		[
			"default-src 'none'",
			"script-src 'self'",
			"connect-src 'self'",
			"img-src 'self'",
			"style-src 'self'",
			"font-src 'self'",
			"report-uri /report",
			"form-action 'self'",
			"frame-ancestors none", //X-Frame-Options
			"upgrade-insecure-requests" //Upgrade http to https requests
		].join(";")
	);
	response.header("Referrer-Policy", "no-referrer"); //apis don't need it

	response.header("X-Frame-Options", "DENY");
	response.header("X-XSS-Protection", "1; report=/report");
	response.header(
		"Strict-Transport-Security",
		"max-age=31536000; includeSubDomains"
	);
	response.header("X-Content-Type-Options", "nosniff");
	response.header("X-Permitted-Cross-Domain-Policies", "none");

	response.header("Expect-CT", 'max-age=86400, enforce, report-uri="/report"');

	next();
});

expressServer.use("/report", (request, response, next) => {
	response.end("");

	logger.log(
		"violation",
		"Received violation by " + request.connection.remoteAddress,
		JSON.stringify(request.body)
	);
});

logger.log("info", "Enabling compression");
expressServer.use(compression());

logger.log("info", "Enabling parsing of json and urlencoded data");
expressServer.use(bodyParser.json({ limit: MAX_HTTP_BODY_SIZE }));
expressServer.use(
	bodyParser.urlencoded({ extended: true, limit: MAX_HTTP_BODY_SIZE })
);

logger.log("info", "Enabling sessions");
expressServer.use(
	expressSession({
		secret: SESSION_SECRET,
		saveUninitialized: true,
		resave: true
	})
);

logger.log("info", "Enabling i18n middleware");
expressServer.use(i18n.init);

expressServer.httpServer = httpServer;

module.exports = expressServer;
