
const express = require('express');
const serviceRoute = express.Router();
const { ServiceController } = require('../controllers');
const uploadCloud = require('../middlewares/UploadCloud');

//serviceRoute.post("/create", uploadCloud.single("image"), ServiceController.CreateNewService);
serviceRoute.post("/create/:id", ServiceController.CreateNewService);
serviceRoute.get("/get-all", ServiceController.getAllService);
//serviceRoute.delete("/delete:id", ServiceController.deleteService);
serviceRoute.delete("/:serviceId/sub-service/:subServiceId", ServiceController.DeleteSubService);
// serviceRoute.put("/update/:id", uploadCloud.single("image"), ServiceController.updateService)
serviceRoute.put("/:id/sub-service/:sid", ServiceController.UpdateSubService)
serviceRoute.get("/get-by-id/:id", ServiceController.getAllServiceById);
serviceRoute.get("/test", async (req, res) => {
    return res.json({ message: "hello world" });
});
module.exports = serviceRoute;

