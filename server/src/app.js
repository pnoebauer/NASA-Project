const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');

const api = require('./routes/api');

const app = express();

app.use(morgan('tiny'));
app.use(
	cors({
		origin: 'http://localhost:3000',
	})
);
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public'))); //serves public folder (e.g. index.html on /index.html)

app.use('/v1', api);

// serves everything where requested route is not setup on express
// app.use((req, res) => {
app.get('/*', (req, res) => {
	// console.log('sending', req.url, path.join(__dirname, '..', 'public', 'index.html'));
	res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;
