const express = require('express');

const {httpGetAllPlanets} = require('./planets.controller');

const planetsRouter = express.Router();

planetsRouter.route('/planets').get(httpGetAllPlanets);
// planetsRouter.get('/planets', httpGetAllPlanets);

module.exports = {planetsRouter};
