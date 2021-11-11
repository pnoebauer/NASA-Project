const request = require('supertest');
const app = require('../../app');

describe('Test GET /launches', () => {
	test('should respond with 200 success', async () => {
		// const response = await request(app).get('/launches');
		// expect(response.statusCode).toBe(200);
		const response = await request(app)
			.get('/launches')
			.expect(200)
			.expect('Content-Type', /json/); //assertion provided by supertest
	});
});

describe('Test POST /launches', () => {
	test('should respond with 201 created', async () => {
		const launchWithoutDate = {
			mission: 'USS Enterprice',
			rocket: 'NCC 1701-D',
			target: 'Kepler-186 f',
		};
		const launch = {...launchWithoutDate, launchDate: '3 Jan 2028'};

		const response = await request(app)
			.post('/launches')
			.send(launch)
			.expect('Content-Type', /json/)
			.expect(201);
		// .expect(res =>
		// 	expect(res.body).toMatchObject({
		// 		...launch,
		// 		launchDate: new Date(launch.launchDate).toISOString(),
		// 	})
		// );

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
			.post('/launches')
			.send(launch)
			.expect('Content-Type', /json/)
			.expect(400)
			.expect(res => expect(res.body.error).toEqual('Missing required launch property'));
	});
	test('catch invalid dates', async () => {
		const launch = {
			mission: 'USS Enterprice',
			rocket: 'NCC 1701-D',
			target: 'Kepler-186 f',
			launchDate: 'hello',
		};
		const response = await request(app)
			.post('/launches')
			.send(launch)
			.expect('Content-Type', /json/)
			.expect(400)
			.expect(res => expect(res.body.error).toEqual('Invalid launch date'));
	});
});
