
const express = require('express');
const { ShoppingCartController } = require('../controllers');
const shoppingCartRoute = express.Router();

shoppingCartRoute.get("/get-card:userId", ShoppingCartController.getShoppingCartByUserId);
module.exports = shoppingCartRoute;

