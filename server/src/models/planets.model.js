const parse = require('csv-parse');
const fs = require('fs');

const path = require('path');

const filePath = path.join(__dirname, '..', '..', 'data', 'kepler_data.csv');

const habitablePlanets = [];

function isHabitablePlanet(planet) {
	return (
		planet['koi_disposition'] === 'CONFIRMED' &&
		planet['koi_insol'] > 0.36 &&
		planet['koi_insol'] < 1.11 &&
		planet['koi_prad'] < 1.6
	);
}

function loadPlanetsData() {
	return new Promise((resolve, reject) => {
		fs.createReadStream(filePath)
			.pipe(
				parse({
					comment: '#',
					columns: true, //returns each row as JS object rather than everything lumped into one array
				})
			)
			.on('data', data => {
				if (isHabitablePlanet(data)) {
					habitablePlanets.push(data);
				}
			})
			.on('error', err => {
				console.log(err);
				return reject(err);
			})
			.on('end', () => {
				// const planetNames = habitablePlanets.map(planet => planet['kepler_name']);
				// console.log(planetNames);
				// console.log(`${habitablePlanets.length} habitable planets found`); //data will be raw buffers of bytes if no pipe is used

				// return resolve(planetNames);
				return resolve();
			});
	});
}

module.exports = {loadPlanetsData, planets: habitablePlanets};
