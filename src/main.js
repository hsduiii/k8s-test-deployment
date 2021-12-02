const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = process.env.PORT || 3000;
const winston = require('winston');

const isDev =
	process.env['NODE_ENV'] === 'development' ||
	process.env['NODE_ENV'] === undefined;

const transport = isDev
	? new winston.transports.Console({ colorize: true })
	: new winston.transports.File({ filename: 'app.log', maxsize: 10000000 });

const logger = winston.createLogger({
	level: 'info',
	format: winston.format.json(),
	defaultMeta: { service: 'user-service' },
	transports: [transport]
});

async function requestLogger(req, res, next) {
	const requestedEndpoint = `${req.method} ${req.url}`;
	logger.info(`${requestedEndpoint}: ${JSON.stringify(req.body)}`);
	try {
		await next();
	} catch (error) {
		logger.info(`${requestedEndpoint}: ERROR ${error.message} `);
		throw error;
	}
}

app.use(requestLogger);

//Get vehicles
app.get('/', (req, res) => {
	fetch(`https://jsonplaceholder.typicode.com/users`)
		.then((res) => res.json()).then(data => {
			logger.info(JSON.stringify(data));
			res.send(data);
		})
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
