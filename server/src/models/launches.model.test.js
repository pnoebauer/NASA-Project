const mongoose = require('mongoose');
require('dotenv').config();

const {getAllLaunches} = require('./launches.model');

const MONGO_URL = `mongodb+srv://nasa-api:${process.env.MONGODB_PASS}@nasacluster.oo9lj.mongodb.net/nasa?retryWrites=true&w=majority`;

beforeAll(async () => {
	await mongoose.connect(MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
});

describe('test launches model', () => {
	test('allLaunches', async () => {
		const allLaunches = await getAllLaunches();
		// console.log({allLaunches});
		expect(allLaunches).toBeInstanceOf(Array);
	});
});
