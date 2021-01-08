import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { donationRecordModel } from "./donationRecordRecord.model";
import httpStatus from "../../utils/httpStatus";
import appConfig from "../../config/env";

const donationRecordController = {};

// Add donationRecord
donationRecordController.add = async (req, res, next) => {
  //
  const { photo, userAbout, bloodType, location, lastTimeDonated } = req.body;

  try {
    const donationRecord = await donationRecordModel.create({
      userId: req.user.userId,
      photo,
      userAbout,
      bloodType,
      location,
      lastTimeDonated
    });

    await donationRecord.save();

    res.json(donationRecord);
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.toString() });
  }
};


// Get All donationRecord
donationRecordController.findAll = async (req, res) => {
  try {
    const user = req.user.userId;
    let donationRecords = await donationRecordModel.find({ userId: user });
    return res.json(donationRecords);
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.toString() });
  }
};

// Get donationRecord By ID
donationRecordController.findOne = async (req, res) => {
  try {
    let donationRecord = await donationRecordModel.findById(req.params.donationRecordId);
    if (!donationRecord) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "donationRecord not found" });
    }
    return res.json(donationRecord);
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.toString() });
  }
};

// Update donationRecord By ID
donationRecordController.update = async (req, res) => {
  try {
    let donationRecord = await donationRecordModel.findById(req.params.donationRecordId);
    if (!donationRecord) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "donationRecord not found" });
    }
    Object.assign(donationRecord, req.body);
    await donationRecord.save();
    return res.json(donationRecord);
  } catch (error) {
    return res.status(500).json({ error: error.toString() });
  }
};

// Delete donationRecord By ID
donationRecordController.delete = async (req, res) => {
  try {
    let donationRecord = await donationRecordModel.findByIdAndRemove(req.params.donationRecordId);
    if (!donationRecord) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "donationRecord not found" });
    }
    return res.json({ message: "donationRecord Deleted Successfully!" });
  } catch (error) {
    return res.status(500).json({ error: error.toString() });
  }
};

export default donationRecordController;
