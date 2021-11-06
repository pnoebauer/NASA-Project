const http = require('http');

const app = require('./app');

const {loadPlanetsData} = require('./models/planets.model');

const port = process.env.PORT || 8000;

const server = http.createServer(app);

// Loading data on startup -------------------------
// wrapper to enable await
async function startServer() {
	await loadPlanetsData(); //make sure that data is loaded before starting up the server

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
