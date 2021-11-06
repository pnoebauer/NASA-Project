const express = require('express');
const path = require('path');
const cors = require('cors');

const morgan = require('morgan');

const {planetsRouter} = require('./routes/planets/planets.router');

const app = express();

app.use(morgan('tiny'));
app.use(
	cors({
		origin: 'http://localhost:3000',
	})
);
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public'))); //serves public folder (e.g. index.html on /index.html)
app.use(planetsRouter);

// serves everything where requested route does not exist
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;
