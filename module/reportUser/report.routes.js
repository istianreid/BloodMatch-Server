import express from "express";
import reportController from "./report.controller";
import { asyncWrapper } from "../../utils/asyncWrapper";
import authenticateToken from "../../middleware/auth";
import isAdmin from "../../middleware/isAdmin";
import onlyOwner from "../../middleware/onlyOwner";


const reportRoutes = express.Router();

// add a report
reportRoutes.post(
  "/",
  [authenticateToken],
  asyncWrapper(reportController.add)
);

// view all 
reportRoutes.get(
  "/", [authenticateToken], 
  asyncWrapper(reportController.findAll));


// view one report
reportRoutes.get(
  "/:reportId",
  [authenticateToken],
  asyncWrapper(reportController.findOne)
);

// update a report
reportRoutes.put(
  "/:reportId",
  [authenticateToken],
  asyncWrapper(reportController.update)
);

// delete a report
reportRoutes.delete(
  "/:reportId",
  [authenticateToken,isAdmin],
  asyncWrapper(reportController.delete)
);


export { reportRoutes };
