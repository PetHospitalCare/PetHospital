const express = require('express');
const { ShoppingCartController } = require('../controllers');
const shoppingCartRoute = express.Router();

shoppingCartRoute.get("/get-card:userId", ShoppingCartController.getShoppingCartByUserId);
shoppingCartRoute.put("/update:userId", ShoppingCartController.updateShoppingCartByUserId);
shoppingCartRoute.post("/payment:userId", ShoppingCartController.payment);
module.exports = shoppingCartRoute;