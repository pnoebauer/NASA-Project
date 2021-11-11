const API_URL = 'http://localhost:8000';

// Load planets and return as JSON.
async function httpGetPlanets() {
	const response = await fetch(`${API_URL}/planets`);
	const data = await response.json();
	return data;
}

// Load launches, sort by flight number, and return as JSON.
async function httpGetLaunches() {
	const response = await fetch(`${API_URL}/launches`);
	const data = await response.json();
	return data.sort((a, b) => a.flightNumber - b.flightNumber);
}

// Submit given launch data to launch system.
async function httpSubmitLaunch(launch) {
	try {
		const response = await fetch(`${API_URL}/launches`, {
			method: 'POST', // *GET, POST, PUT, DELETE, etc.
			mode: 'cors', // no-cors, *cors, same-origin
			cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
			credentials: 'same-origin', // include, *same-origin, omit
			headers: {'Content-Type': 'application/json'},
			redirect: 'follow', // manual, *follow, error
			referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
			body: JSON.stringify(launch), // body data type must match "Content-Type" header
		});

		return response;
	} catch (e) {
		return {ok: false};
	}
}

// Delete launch with given ID.
async function httpAbortLaunch(id) {
	try {
		const response = await fetch(`${API_URL}/launches/${id}`, {
			method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
			mode: 'cors', // no-cors, *cors, same-origin
			cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
			credentials: 'same-origin', // include, *same-origin, omit
			redirect: 'follow', // manual, *follow, error
			referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
		});

		return response;
	} catch (e) {
		return {ok: false};
	}
}

export {httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch};
