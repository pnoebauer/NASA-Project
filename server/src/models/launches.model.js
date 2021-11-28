const axios = require('axios');

const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo');

const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
	flightNumber: 100, // =flight_number in SPACEX API res object
	launchDate: new Date('28 Dec 2030'), // =date_local in SPACEX API res object
	mission: 'Sample Mission', // =name in SPACEX API res object
	rocket: 'Explorer IS1', // =rocket.name in SPACEX API res object
	target: 'Kepler-1652 b', // does not exist in SPACEX API res object
	customers: ['NASA', 'NOAA'], // =payload.customers for each payload in SPACEX API res object
	upcoming: true, // =upcoming in SPACEX API res object
	success: true, // =success in SPACEX API res object
};

saveLaunch(launch);

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

async function populateLaunches() {
	console.log('downloading launch data ...');

	const res = await axios.post(SPACEX_API_URL, {
		query: {},
		options: {
			pagination: false,
			populate: [
				{
					path: 'rocket',
					select: {
						name: 1,
					},
				},
				{
					path: 'payloads',
					select: {
						customers: 1,
					},
				},
			],
		},
	});

	if (res.status !== 200) {
		console.log('Problem downloading launch data');
		throw new Error('Launch data download failed');
	}

	const launchDocs = res.data.docs;
	for (const launchDoc of launchDocs) {
		const payloads = launchDoc.payloads;
		const customers = payloads.flatMap(payload => payload.customers);

		const launch = {
			flightNumber: launchDoc.flight_number,
			mission: launchDoc.name,
			rocket: launchDoc.rocket.name,
			launchDate: launchDoc.date_local,
			upcoming: launchDoc.upcoming,
			success: launchDoc.success,
			customers,
		};
		console.log(launch.flightNumber, launch.mission);

		await saveLaunch(launch);
	}
}

async function loadLaunchesData() {
	//check if first launch from SpaceX already exists in DB
	const firstLaunch = await findLaunch({
		flightNumber: 1,
		rocket: 'Falcon 1',
		mission: 'FalconSat',
	});

	if (firstLaunch) {
		console.log('Launch data has already been loaded!');
	} else {
		//populate launches collection
		await populateLaunches();
	}
}

async function findLaunch(filter) {
	return await launchesDatabase.findOne(filter);
}

async function existsLaunchWithId(launchId) {
	return await findLaunch({flightNumber: launchId});
}

async function getLatestFlightNumber() {
	const latestLaunch = await launchesDatabase.findOne({}).sort({flightNumber: -1});

	if (!latestLaunch) {
		return DEFAULT_FLIGHT_NUMBER;
	}

	return latestLaunch.flightNumber;
}

async function getAllLaunches(skip, limit) {
	return await launchesDatabase.find({}, {_id: 0, __v: 0}).skip(skip).limit(limit);
}

async function saveLaunch(launch) {
	await launchesDatabase.findOneAndUpdate(
		{
			flightNumber: launch.flightNumber,
		},
		launch,
		{upsert: true}
	);
}

async function scheduleNewLaunch(launch) {
	const planet = await planets.findOne({
		keplerName: launch.target,
	});

	if (!planet) {
		throw new Error('No matching planet was found');
	}

	const newFlightNumber = (await getLatestFlightNumber()) + 1;

	const newLaunch = Object.assign(launch, {
		success: true,
		upcoming: true,
		customers: ['NASA', 'NOAA'],
		flightNumber: newFlightNumber,
	});

	await saveLaunch(newLaunch);
}

async function abortLaunchById(launchId) {
	const aborted = await launchesDatabase.updateOne(
		{
			flightNumber: launchId,
		},
		{upcoming: false, success: false}
	);

	return aborted.matchedCount === 1 && aborted.modifiedCount === 1;
}

module.exports = {
	loadLaunchesData,
	existsLaunchWithId,
	getAllLaunches,
	scheduleNewLaunch,
	abortLaunchById,
};
