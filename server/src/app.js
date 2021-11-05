const express = require('express');
const cors = require('cors');

const morgan = require('morgan');

const {planetsRouter} = require('./routes/planets/planets.router');

const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(planetsRouter);

module.exports = app;
