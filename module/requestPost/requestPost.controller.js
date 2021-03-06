import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { requestPostModel } from "./requestPost.model";
import {userModel} from "../user/user.model"
import httpStatus from "../../utils/httpStatus";
import appConfig from "../../config/env";

const requestPostController = {};

// Add requestPost
requestPostController.add = async (req, res, next) => {
  //
  const {title, story, photo, datePost, bloodType, amount, location, phoneNumber, closingDate, hospital, status, referenceNumber} = req.body;

  try {

    const requestPost = await requestPostModel.create({
      userId: req.user.userId,
      title, 
      story, 
      photo, 
      bloodType, 
      amount, 
      location, 
      phoneNumber, 
      closingDate, 
      hospital, 
      status,
      referenceNumber,
      datePost
    });

    const user = await userModel.findByIdAndUpdate(req.user.userId,{
      userId: req.user.userId,
      requestPostId: requestPost._id
    })

    Object.assign(user, req.body)

    await requestPost.save();
    return res.status(httpStatus.OK).json({ 
      status: {type: "success", code: httpStatus.OK},
      message: "RequestPost add successfully!" ,
      data: requestPost
    });

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ 
      status: {type: "error", code: httpStatus.INTERNAL_SERVER_ERROR},
      data : null,
      error: error.toString() 
    });
  }
};

// Update requestPost By ID

requestPostController.update = async (req, res) => {
  try {
    let requestPost = await requestPostModel.findById(req.params.requestPostId);
    if (!requestPost) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: {type: "error", code: httpStatus.BAD_REQUEST},
        message: "requestPost not found",
        data: null
      });
    }
    Object.assign(requestPost, req.body);
    await requestPost.save();
    return res.status(httpStatus.OK).json({ 
      status: {type: "success", code: httpStatus.OK},
      message: "successfully Update Request" ,
      data: requestPost
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ 
      status: {type: "error", code: httpStatus.INTERNAL_SERVER_ERROR},
      data : null,
      error: error.toString() 
    });
  }
};

// Get All requestPost
requestPostController.findAll = async (req, res) => {
  try {
    let requestPosts = await requestPostModel.find();
    return res.status(httpStatus.OK).json({ 
      status: {type: "success", code: httpStatus.OK},
      message: "all Request" ,
      data: requestPosts
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ 
      status: {type: "error", code: httpStatus.INTERNAL_SERVER_ERROR},
      data : null,
      error: error.toString() 
    });
  }
};

// Get requestPost By ID
requestPostController.findOne = async (req, res) => {
  try {
    let requestPost = await requestPostModel.findById(req.params.requestPostId);
    if (!requestPost) {
      return res.status(httpStatus.BAD_REQUEST).json({

          status: {type: "error", code: httpStatus.BAD_REQUEST},
          message: "requestPost not found",
          data: null
      });
    }
    return res.status(httpStatus.OK).json({ 
        status: {type: "success", code: httpStatus.OK},
        message: "You're Request" ,
        data: requestPost
      });
    } catch (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ 
        status: {type: "error", code: httpStatus.INTERNAL_SERVER_ERROR},
        data : null,
        error: error.toString() 
    });
   }
};


// Delete requestPost By ID
requestPostController.delete = async (req, res) => {
  try {
    let requestPost = await requestPostModel.findByIdAndRemove(req.params.requestPostId);
    if (!requestPost) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: {type: "error", code: httpStatus.BAD_REQUEST},
        message: "requestPost not found",
        data: null
      });
    }
    return res.status(httpStatus.OK).json({ 
      status: {type: "success", code: httpStatus.OK},
      message: "requestPost Deleted Successfully!" ,
      data: requestPost
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ 
      status: {type: "error", code: httpStatus.INTERNAL_SERVER_ERROR},
      data : null,
      error: error.toString() 
    });
  }
};

export default requestPostController;
