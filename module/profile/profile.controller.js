import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { profileModel } from "./profile.model";
import httpStatus from "../../utils/httpStatus";
import appConfig from "../../config/env";

import path from 'path'
import multer from 'multer'

const profileController = {};

// upload Photo
profileController.upload = async (req, res) => {

    try {

      
      let profile = await profileModel.findByIdAndUpdate(req.params.profileId,{
        userId: req.user.userId,
        photo: req.file.filename
      });
      if (!profile) {

        return res.status(httpStatus.BAD_REQUEST).json({ 

          status: {type: "error", code: httpStatus.BAD_REQUEST},
          message: "profile not found" ,
          data : null

        });
      }

      Object.assign(profile, req.body);
      return res.status(httpStatus.OK).json({ 

        status: {type: "success", code: httpStatus.OK},
        message: "Profile Upload successfully!" ,
        data: profile
  
      });

    } catch (error) {

      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ 

        status: {type: "error", code: httpStatus.INTERNAL_SERVER_ERROR},
        data : null,
        error: error.toString() 
  
      });
    }
}

// Update profile By ID
profileController.update = async (req, res) => {

  console.log(req)


  try {
    let profile = await profileModel.findById(req.params.profileId);
    if (!profile) {
      return res.status(httpStatus.BAD_REQUEST).json({
      
        status: {type: "error", code: httpStatus.BAD_REQUEST},
        message: "profile not found" ,
        data : null

      });
    }
    Object.assign(profile, req.body);
    await profile.save();
    return res.status(httpStatus.OK).json({ 

      status: {type: "success", code: httpStatus.OK},
      message: "Profile Update successfully!" ,
      data: profile

    });
  }
  catch (error) {

    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ 
      status: {type: "error", code: httpStatus.INTERNAL_SERVER_ERROR},
      data : null,
      error: error.toString() 
    });

  }
};

// Get All profile

profileController.findAll = async (req, res) => {
  try {
    const user = req.user.userId;
    let profiles = await profileModel.find({ userId: user });
    return res.status(httpStatus.OK).json({ 
      status: {type: "success", code: httpStatus.OK},
      message: "successfully get all profile" ,
      data: profiles
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ 
      status: {type: "error", code: httpStatus.INTERNAL_SERVER_ERROR},
      data : null,
      error: error.toString() 
    });
  }
};

// Get profile By ID
profileController.findOne = async (req, res) => {

  try {
    let profile = await profileModel.findById(req.params.profileId);
    if (!profile) {
      return res.status(httpStatus.BAD_REQUEST).json({ 
        status: {type: "error", code: httpStatus.BAD_REQUEST},
        message: "profile not found" ,
        data : null
      });
    }
    return res.status(httpStatus.OK).json({ 
      status: {type: "success", code: httpStatus.OK},
      message: "successfully get your profile" ,
      data: profile
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ 
      status: {type: "error", code: httpStatus.INTERNAL_SERVER_ERROR},
      data : null,
      error: error.toString() 
    });
  }
};

// Delete profile By ID
profileController.delete = async (req, res) => {
  try {
    let profile = await profileModel.findByIdAndRemove(req.params.profileId);
    if (!profile) {

      return res.status(httpStatus.BAD_REQUEST).json({ 

          status: {type: "error", code: httpStatus.BAD_REQUEST},
          message: "profile not found" ,
          data : null

        });
    }
    return res.status(httpStatus.OK).json({ 

      status: {type: "success", code: httpStatus.OK},
      message: "profile Deleted Successfully!" ,
      data: profile

    });
  } catch (error) {
    
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ 

      status: {type: "error", code: httpStatus.INTERNAL_SERVER_ERROR},
      data : null,
      error: error.toString() 

    });
  }
};

export default profileController;
