const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo');

const launches = new Map();

let latestFlightNumber = 100;

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

// launches.set(launch.flightNumber, launch); //set key/value
// launches.get(100);

function existsLaunchWithId(launchId) {
	return launches.has(launchId);
}

async function getAllLaunches() {
	// return Array.from(launches.values());
	return await launchesDatabase.find({}, {_id: 0, __v: 0});
}

async function saveLaunch(launch) {
	const planet = await planets.findOne({
		keplerName: launch.target,
	});

	if (!planet) {
		throw new Error('No matching planet was found');
	}

	await launchesDatabase.updateOne(
		{
			flightNumber: launch.flightNumber,
		},
		launch,
		{upsert: true}
	);
}

function addNewLaunch(launch) {
	latestFlightNumber++;

	launches.set(
		latestFlightNumber,
		Object.assign(launch, {
			success: true,
			upcoming: true,
			customers: ['NASA', 'NOAA'],
			flightNumber: latestFlightNumber,
		})
	);
}

function abortLaunchById(launchId) {
	const aborted = launches.get(launchId);
	aborted.upcoming = false; //after abortion it is not not upcoming anymore
	aborted.success = false;

	return aborted;
}

module.exports = {existsLaunchWithId, getAllLaunches, addNewLaunch, abortLaunchById};
