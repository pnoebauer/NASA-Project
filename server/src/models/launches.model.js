const launches = new Map();

const launch = {
	flightNumber: 100,
	launchDate: new Date('28 Dec 2030'),
	mission: 'Sample Mission',
	rocket: 'Explorer IS1',
	target: 'Kepler-1652 b',
	customers: ['NASA', 'NOA'],
	upcoming: true,
	success: true,
};

launches.set(launch.flightNumber, launch); //set key/value
// launches.get(100);

module.exports = {launches};
