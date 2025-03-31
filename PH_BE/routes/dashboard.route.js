const express = require("express");
const { DashBoardController } = require("../controllers");

const DashboardRouter = express.Router();
DashboardRouter.get("/test/:timerange", DashBoardController.GetBookingByTime);
DashboardRouter.get("/test2/:timeRange", DashBoardController.getAllRevenueByTime);
DashboardRouter.get("/test3/:timeRange", DashBoardController.getDataforCard);
module.exports = DashboardRouter;