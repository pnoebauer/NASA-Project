const request = require('supertest');

const app = require('../../app');
const {loadPlanetsData} = require('../../models/planets.model');
const {mongoConnect, mongoDisconnect} = require('../../services/mongo');

describe('Launches API', () => {
	beforeAll(async () => {
		await mongoConnect();
		await loadPlanetsData();
	});

	afterAll(async () => {
		await mongoDisconnect();
	});

	describe('Test GET /v1/launches', () => {
		test('should respond with 200 success', async () => {
			// const response = await request(app).get('/v1/launches');
			// expect(response.statusCode).toBe(200);
			const response = await request(app)
				.get('/v1/launches')
				.expect(200)
				.expect('Content-Type', /json/); //assertion provided by supertest
			// console.log({response});
		});
	});

	describe('Test POST /v1/launches', () => {
		test('should respond with 201 created', async () => {
			const launchWithoutDate = {
				mission: 'USS Enterprice',
				rocket: 'NCC 1701-D',
				target: 'Kepler-62 f',
			};
			const launch = {...launchWithoutDate, launchDate: '3 Jan 2028'};

			const response = await request(app)
				.post('/v1/launches')
				.send(launch)
				.expect('Content-Type', /json/)
				.expect(201);
			// .expect(res =>
			// 	expect(res.body).toMatchObject({
			// 		...launch,
			// 		launchDate: new Date(launch.launchDate).toISOString(),
			// 	})
			// );

			// console.log({response});

			// assert using JEST (above using supertest)
			expect(response.body).toMatchObject(launchWithoutDate);
			// expect(response.body).toEqual(
			// 	expect.objectContaining({
			// 		...launch,
			// 		launchDate: new Date(launch.launchDate).toISOString(),
			// 	})
			// );

			const responseDate = new Date(response.body.launchDate).getTime();
			const requestDate = new Date(launch.launchDate).getTime();
			expect(responseDate).toEqual(requestDate);
		});
		test('catch missing required properties', async () => {
			// missing target in launch object
			const launch = {
				mission: 'USS Enterprice',
				rocket: 'NCC 1701-D',
				launchDate: '3 Jan 2028',
			};
			const response = await request(app)
				.post('/v1/launches')
				.send(launch)
				.expect('Content-Type', /json/)
				.expect(400)
				.expect(res =>
					expect(res.body.error).toEqual('Missing required launch property')
				);
		});
		test('catch invalid dates', async () => {
			const launch = {
				mission: 'USS Enterprice',
				rocket: 'NCC 1701-D',
				target: 'Kepler-62 f',
				launchDate: 'hello',
			};
			const response = await request(app)
				.post('/v1/launches')
				.send(launch)
				.expect('Content-Type', /json/)
				.expect(400)
				.expect(res => expect(res.body.error).toEqual('Invalid launch date'));
		});
	});
});
