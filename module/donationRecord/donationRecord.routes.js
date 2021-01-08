import express from "express";
import donationRecordController from "./donationRecordRecord.controller";
import { asyncWrapper } from "../../utils/asyncWrapper";
import authenticateToken from "../../middleware/auth";
import isAdmin from "../../middleware/isAdmin";
import onlyOwner from "../../middleware/onlyOwner";


const donationRecordRoutes = express.Router();

// add a donationRecord
donationRecordRoutes.post(
  "/",
  [authenticateToken],
  asyncWrapper(donationRecordController.add)
);

// view all 
donationRecordRoutes.get(
  "/", [authenticateToken], 
  asyncWrapper(donationRecordController.findAll));


// view one donationRecord
donationRecordRoutes.get(
  "/:donationRecordId",
  [authenticateToken],
  asyncWrapper(donationRecordController.findOne)
);

// update a donationRecord
donationRecordRoutes.put(
  "/:donationRecordId",
  [authenticateToken],
  asyncWrapper(donationRecordController.update)
);

// delete a donationRecord
donationRecordRoutes.delete(
  "/:donationRecordId",
  [authenticateToken,isAdmin],
  asyncWrapper(donationRecordController.delete)
);


export { donationRecordRoutes };
