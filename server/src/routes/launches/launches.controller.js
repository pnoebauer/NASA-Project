const {getAllLaunches, addNewLaunch} = require('../../models/launches.model');

function httpGetAllLaunches(req, res) {
	return res.status(200).json(getAllLaunches());
}

function httpPostLaunch(req, res) {
	const launch = req.body;

	const {launchDate, mission, rocket, target} = launch;

	if (!launchDate || !mission || !rocket || !target) {
		return res.status(400).json({
			error: 'Missing required launch property',
		});
	}

	launch.launchDate = new Date(launch.launchDate);
	// if (launch.launchDate.toString() === 'Invalid Date') {
	//isNaN(launch.launchDate.valueOf()) in the background (if valid, valueOf will return ms unix format)
	if (isNaN(launch.launchDate)) {
		return res.status(400).json({
			error: 'Invalid launch date',
		});
	}
	addNewLaunch(launch);

	return res.status(201).json(launch);
}

module.exports = {httpGetAllLaunches, httpPostLaunch};
