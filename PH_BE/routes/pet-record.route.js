
const express = require('express');
const { PetRecordController } = require('../controllers');
const petRecordRoute = express.Router();

petRecordRoute.get("/get-all", PetRecordController.getAllPetRecords);
petRecordRoute.get("/get-by-account/:id", PetRecordController.getAllPetByAccount);
module.exports = petRecordRoute;

