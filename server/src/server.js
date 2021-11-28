const http = require('http');

require('dotenv').config();

const app = require('./app');
const {mongoConnect} = require('./services/mongo');
const {loadPlanetsData} = require('./models/planets.model');
const {loadLaunchesData} = require('./models/launches.model');

const port = process.env.PORT || 8000;

const server = http.createServer(app);

// Loading data on startup -------------------------
// wrapper to enable await
async function startServer() {
	await mongoConnect();
	await loadPlanetsData(); //make sure that data is loaded before starting up the server
	await loadLaunchesData();

	server.listen(port, () => {
		console.log(`Server is running on port:${port}`);
	});
}
// --------------------------------------------------

startServer();

// shorthand version of passing it into server
// same as http.createServer(app).listen
// app.listen(port, () => {
// 	console.log(`Server is running on port:${port}`);
// });
