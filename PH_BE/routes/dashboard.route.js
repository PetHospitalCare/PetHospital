const express = require("express");
const { DashBoardController } = require("../controllers");
const { verifyToken, authorize } = require("../middlewares/auth");
const DashboardRouter = express.Router();
DashboardRouter.get("/test/:timerange", verifyToken, authorize("admin"), DashBoardController.GetBookingByTime);
DashboardRouter.get("/test2/:timeRange", DashBoardController.getAllRevenueByTime);
DashboardRouter.get("/test3/:timeRange", DashBoardController.getDataforCard);
module.exports = DashboardRouter;