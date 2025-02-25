
const express = require('express');
const { PetRecordController } = require('../controllers');
const petRecordRoute = express.Router();

petRecordRoute.get("/get-all", PetRecordController.getAllPetRecords);

module.exports = petRecordRoute;

