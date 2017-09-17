const logger = require("lazuli-require")("lazuli-logger");
const i18n = require("lazuli-require")("lazuli-i18n");

const { HTTP_PORT, SESSION_SECRET } = require("lazuli-require")(
	"lazuli-config"
);

const express = require("express");
const expressSession = require("express-session");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const compression = require("compression");

const valueFilter = require("./value-filter");
const eventEmitter = require("./event-emitter");

//

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

eventEmitter.emit("express.init.before", expressServer);

logger.log("info", "Enabling gzip compression");
expressServer.use(compression());

logger.log("info", "Enabling parsing of json and urlencoded data");
expressServer.use(bodyParser.json());
expressServer.use(bodyParser.urlencoded({ extended: true }));

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

logger.log("info", "Enabling express helmet");
expressServer.use(helmet());

logger.log("info", "Configuring cors");
expressServer.use((request, response, next) => {
	response.header("Access-Control-Allow-Origin", "*");
	response.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);
	response.header(
		"Access-Control-Allow-Methods",
		"HEAD, OPTIONS, GET, POST, PUT, DELETE"
	);

	next();
});

eventEmitter.emit("express.init.after", expressServer);

module.exports = { expressServer, httpServer };
