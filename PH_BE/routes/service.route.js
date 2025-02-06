
const express = require('express');
const serviceRoute = express.Router();
const { ServiceController } = require('../controllers');

serviceRoute.post("/create", ServiceController.CreateNewService);
serviceRoute.get("/get-all",ServiceController.getAllService);
serviceRoute.delete("/delete:id", ServiceController.deleteService);
serviceRoute.put("/update/:id",ServiceController.updateService)
serviceRoute.get("/test", async (req, res) => {
    return res.json({ message: "hello world" });
});
module.exports = serviceRoute;

