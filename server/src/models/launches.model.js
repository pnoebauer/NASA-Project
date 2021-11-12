const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo');

const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
	flightNumber: 100,
	launchDate: new Date('28 Dec 2030'),
	mission: 'Sample Mission',
	rocket: 'Explorer IS1',
	target: 'Kepler-1652 b',
	customers: ['NASA', 'NOAA'],
	upcoming: true,
	success: true,
};

saveLaunch(launch);

async function existsLaunchWithId(launchId) {
	return await launchesDatabase.findOne({flightNumber: launchId});
}

async function getLatestFlightNumber() {
	const latestLaunch = await launchesDatabase.findOne({}).sort({flightNumber: -1});

	if (!latestLaunch) {
		return DEFAULT_FLIGHT_NUMBER;
	}

	return latestLaunch.flightNumber;
}

async function getAllLaunches() {
	return await launchesDatabase.find({}, {_id: 0, __v: 0});
}

async function saveLaunch(launch) {
	const planet = await planets.findOne({
		keplerName: launch.target,
	});

	if (!planet) {
		throw new Error('No matching planet was found');
	}

	await launchesDatabase.findOneAndUpdate(
		{
			flightNumber: launch.flightNumber,
		},
		launch,
		{upsert: true}
	);
}

async function scheduleNewLaunch(launch) {
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

module.exports = {existsLaunchWithId, getAllLaunches, scheduleNewLaunch, abortLaunchById};
