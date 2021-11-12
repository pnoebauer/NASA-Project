const request = require('supertest');

const {mongoConnect, mongoDisconnect} = require('../services/mongo');

const {getAllLaunches} = require('./launches.model');

describe('Launches Model Unit Tests', () => {
	beforeAll(async () => {
		await mongoConnect();
	});

	afterAll(async () => {
		await mongoDisconnect();
	});

	describe('test launches model', () => {
		test('allLaunches', async () => {
			const allLaunches = await getAllLaunches();
			// console.log({allLaunches});
			expect(allLaunches).toBeInstanceOf(Array);
		});
	});
});
