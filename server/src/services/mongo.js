const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URL = `mongodb+srv://nasa-api:${process.env.MONGODB_PASS}@nasacluster.oo9lj.mongodb.net/nasa?retryWrites=true&w=majority`;

// event emitter, emits when connection is ready or errors, etc.
mongoose.connection.once('open', () => {
	console.log('MongoDB connection ready');
});
mongoose.connection.on('error', err => {
	console.error(err);
});

async function mongoConnect() {
	await mongoose.connect(MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
}

async function mongoDisconnect() {
	console.log('shutting down');
	await mongoose.disconnect();
	await new Promise(resolve => setTimeout(() => resolve(), 500));
	await mongoose.connection.close();
}

module.exports = {mongoConnect, mongoDisconnect};
