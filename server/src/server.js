const http = require('http');
const mongoose = require('mongoose');
require('dotenv').config();

const app = require('./app');

const {loadPlanetsData} = require('./models/planets.model');

const port = process.env.PORT || 8000;

const MONGO_URL = `mongodb+srv://nasa-api:${process.env.MONGODB_PASS}@nasacluster.oo9lj.mongodb.net/nasa?retryWrites=true&w=majority`;

const server = http.createServer(app);

// event emitter, emits when connection is ready or errors, etc.
mongoose.connection.once('open', () => {
	console.log('MongoDB connection ready');
});
mongoose.connection.on('error', err => {
	console.error(err);
});

// console.log({MONGO_URL});

// Loading data on startup -------------------------
// wrapper to enable await
async function startServer() {
	await mongoose.connect(MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});

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
