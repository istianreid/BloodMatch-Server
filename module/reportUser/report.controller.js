import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { reportModel } from "./report.model";
import httpStatus from "../../utils/httpStatus";
import appConfig from "../../config/env";

import path from 'path'
import multer from 'multer'

const reportController = {};

// Add report
reportController.add = async (req, res, next) => {
  //
  const { violation, description, ReferenceNumber, reportUserId} = req.body;

  try {
    const report = await reportModel.create({
      userId: req.user.userId,
      violation,
      description,
      createDate:{type: Date, default: Date.now},
      ReferenceNumber,
      reportUserId 
     
    });

    await report.save();

    res.json(report);
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.toString() });
  }
};


// Get All report
reportController.findAll = async (req, res) => {
  try {
    const user = req.user.userId;
    let reports = await reportModel.find({ userId: user });
    return res.json(reports);
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.toString() });
  }
};

// Get report By ID
reportController.findOne = async (req, res) => {
  try {
    let report = await reportModel.findById(req.params.reportId);
    if (!report) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "report not found" });
    }
    return res.json(report);
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.toString() });
  }
};


// Update report By ID
reportController.update = async (req, res) => {
  try {
    let report = await reportModel.findById(req.params.reportId);
    if (!report) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "report not found" });
    }
    Object.assign(report, req.body);
    await report.save();
    return res.json(report);
  } catch (error) {
    return res.status(500).json({ error: error.toString() });
  }
};

// Delete report By ID
reportController.delete = async (req, res) => {
  try {
    let report = await reportModel.findByIdAndRemove(req.params.reportId);
    if (!report) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "report not found" });
    }
    return res.json({ message: "report Deleted Successfully!" });
  } catch (error) {
    return res.status(500).json({ error: error.toString() });
  }
};

export default reportController;
