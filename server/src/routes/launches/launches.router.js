const express = require('express');

const {httpGetAllLaunches, httpPostLaunch} = require('./launches.controller');

const launchesRouter = express.Router();

launchesRouter.route('/').get(httpGetAllLaunches).post(httpPostLaunch);

module.exports = {launchesRouter};
