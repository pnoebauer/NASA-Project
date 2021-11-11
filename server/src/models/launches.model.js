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

launches.set(launch.flightNumber, launch); //set key/value
// launches.get(100);

function getAllLaunches() {
	return Array.from(launches.values());
}

function addNewLaunch(launch) {
	latestFlightNumber++;
	// launches.set(latestFlightNumber, {
	// 	...launch,
	// 	success: true,
	// 	upcoming: true,
	// 	customers: ['NASA', 'NOAA'],
	// 	flightNumber: latestFlightNumber,
	// });
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

module.exports = {getAllLaunches, addNewLaunch};
