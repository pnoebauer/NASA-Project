const express = require('express');

const {httpGetAllLaunches} = require('./launches.controller');

const launchesRouter = express.Router();

launchesRouter.route('/launches').get(httpGetAllLaunches);

module.exports = {launchesRouter};
