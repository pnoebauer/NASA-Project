const parse = require('csv-parse');
const fs = require('fs');
const path = require('path');

const planets = require('./planets.mongo');

// const habitablePlanets = [];

function isHabitablePlanet(planet) {
	return (
		planet['koi_disposition'] === 'CONFIRMED' &&
		planet['koi_insol'] > 0.36 &&
		planet['koi_insol'] < 1.11 &&
		planet['koi_prad'] < 1.6
	);
}

const filePath = path.join(__dirname, '..', '..', 'data', 'kepler_data.csv');
function loadPlanetsData() {
	return new Promise((resolve, reject) => {
		fs.createReadStream(filePath)
			.pipe(
				parse({
					comment: '#',
					columns: true, //returns each row as JS object rather than everything lumped into one array
				})
			)
			.on('data', async data => {
				if (isHabitablePlanet(data)) {
					// habitablePlanets.push(data);
					const planet = {keplerName: data.kepler_name};
					await savePlanet(planet);
				}
			})
			.on('error', err => {
				console.log(err);
				return reject(err);
			})
			.on('end', async () => {
				// const planetNames = habitablePlanets.map(planet => planet['kepler_name']);
				// console.log(planetNames);
				// console.log(`${habitablePlanets.length} habitable planets found`); //data will be raw buffers of bytes if no pipe is used
				const countPlanetsFound = (await getAllPlanets()).length;
				console.log(`${countPlanetsFound} habitable planets found`);
				// return resolve(planetNames);
				return resolve();
			});
	});
}

async function getAllPlanets() {
	// return habitablePlanets;
	return await planets.find({});
}

async function savePlanet(planet) {
	try {
		await planets.updateOne(planet, planet, {upsert: true});
	} catch (e) {
		console.error(`Could not save planet ${e}`);
	}
}

module.exports = {loadPlanetsData, getAllPlanets};
