import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userModel } from "./user.model";
import { profileModel } from "../profile/profile.model"
import httpStatus from "../../utils/httpStatus";
import appConfig from "../../config/env";
import crypto from "crypto-random-string";
import nodemailer from "nodemailer";

import mustache from "mustache"
import path from 'path'
import fs from 'fs'

const userController = {};

// Create User
userController.register = async (req, res, next) => {
  userModel
    .find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(httpStatus.CONFLICT).json({
          status: { type: "emailExists", code: httpStatus.CONFLICT, },
          message: "Mail exists",
          data: null,
        });
      } else {
        bcrypt.hash(req.body.password, 10, async (err, hash) => {
          if (req.body.password === "") {
            return res.status(httpStatus.EXPECTATION_FAILED).json({
              status: { type: "invalidPassword", code: httpStatus.EXPECTATION_FAILED, },
              message: "null pass",
              data: null,
            });
          }else if (err) {
            return res.status(httpStatus.EXPECTATION_FAILED).json({
              status: { type: "invalidPassword", code: httpStatus.EXPECTATION_FAILED, },
              message: "invalid password",
              data: null,
            });
          } else {
            
            const activation = crypto({ length: 16, type: "alphanumeric" });

            const transporter = nodemailer.createTransport({

              service: "gmail",
              auth: {
                user: "istianreid@gmail.com",
                pass: appConfig.gmail_password,
                // naturally, replace both with your real credentials or an application-specific password
              },
              tls: {
                rejectUnauthorized: false,
              },
              
            });

            const filePath = path.join(__dirname, "activation.html");
            var content = await fs.readFileSync(filePath, "utf-8");
            var view = {
              url: `https://bloodmatchclient.herokuapp.com/activate/${activation}`,
              name: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
              },
            };

            var activationEmail = mustache.render(content, view);

            // email activation to user
            const mailOptions = {
              from: "istianreid@gmail.com",
              to: req.body.email,
              subject: "Activate your account",
              html: activationEmail,
            };

            transporter.sendMail(mailOptions, async function (err, info) {
              if (err) {
                console.log(err);

                res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                  error: err,
                });
              } else {
                console.log(info);

                const newUser = await userModel.create({
                  email: req.body.email,
                  password: hash,
                  firstName: req.body.firstName,
                  lastName: req.body.lastName,
                  city: req.body.city,
                  mobileNumber: req.body.mobileNumber,
                  role: req.body.role,
                  activation_key: activation,
                  profileId:"",
                  requestPostId:""
                });

                const profile = await profileModel.create({
                  userId: newUser._id,
                  photo: "",
                  userAbout: "", 
                  bloodType: "", 
                  location: "", 
                  lastTimeDonated: ""
                });

                console.log(newUser._id)
                console.log(profile._id)

                const user = await userModel.findByIdAndUpdate(newUser._id,{
                  userId: newUser._id,
                  profileId: profile._id
                })
                Object.assign(user, req.body)

                await profile.save();

                if (newUser) {
                  return res.status(httpStatus.CREATED).json({
                    status: { type: "registerSuccessful", code: httpStatus.OK },
                    message: "Register successful",
                    data: null,
                  });
                } else {
                  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    status: { type: "registeFailed", code: httpStatus.INTERNAL_SERVER_ERROR, },
                    message: "Register failed",
                    data: null,
                  });
                }
              }
            });
          }
        });
      }
    });
};

// Login user
userController.login = async (req, res, next) => {
  userModel
    .find({ email: req.body.email })
    .exec()
    .then((user) => {
      console.log(user);
      if (user.length < 1) {
        return res.status(httpStatus.NOT_ACCEPTABLE).json({
          status: { type: "Invalid", code: httpStatus.NOT_ACCEPTABLE },
          message: "your not registered",
          data: null,
        });
      }

      if (!user[0].is_active) {
        return res.status(httpStatus.UPGRADE_REQUIRED).json({
          status: { type: "notActivated", code: httpStatus.UPGRADE_REQUIRED },
          message: "Not yet activated",
          data: null
        });
      }

      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(httpStatus.EXPECTATION_FAILED).json({
            status: { type: "invalidPassword", code: httpStatus.UNAEXPECTATION_FAILEDUTHORIZED },
            message: "Auth failed",
            data: null
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0].id,
              mobileNumber: user[0].mobileNumber,
              firstName: user[0].firstName,
              lastName: user[0].lastName,
              city: user[0].city,
              role: user[0].role,
              profileId: user[0].profileId
            },
              appConfig.jwt_key,
            {
              expiresIn: appConfig.jwt_expiration,
            }
          );
          return res.status(httpStatus.OK).json({
            status: { type: "loginSuccess", code: httpStatus.OK },
            message: "Auth successful",
            data: { token },
          });
        }
        res.status(httpStatus.UNAUTHORIZED).json({
          status: { type: "loginError", code: httpStatus.UNAUTHORIZED },
          message: "Auth failed",
          data: null,
        });
      });
    })
    .catch((err) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        error: err,
      });
    });
};

userController.activate = async (req, res) => {
  console.log(req.params.activation);

  try {
    const activation = req.params.activation;

    let user = await userModel.findOneAndUpdate(
      {
        activation_key: activation,
      },
      { $set: { is_active: true, activation_key: "" } },
      (err, doc) => {
        if (err) {
          console.log("Activation Error!");
          return res.status(httpStatus.BAD_REQUEST).json({ 
            status: {type: "error", code: httpStatus.BAD_REQUEST,},
            message: "Activation error" 
          });
        }

        if (!doc) {
          //pag mali ung activation code
          return res.status(httpStatus.BAD_REQUEST).json({
            status: {type: "error", code: httpStatus.BAD_REQUEST,},
            message: "Activation key not found",
            data: null,
          });

        }else {
          return res.status(httpStatus.OK).json({
            status: {type: "success", code: httpStatus.OK,},
            message: "You have successfully activated your account.",
            data: null,
        });
        }
      }
    );
  } catch (err) {
    console.log(err);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: {type: "error", code: httpStatus.INTERNAL_SERVER_ERROR,},
            message: "Invalid",
            data: null,
    });
  }
};

// Get All Users
userController.findAll = async (req, res) => {
  try {
    let users = await userModel.find();

    return res.status(httpStatus.OK).json({
      status: {type: "success", code: httpStatus.OK,},
      message: "all users",
      users
    });

  } catch (err) {

    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: {type: "error", code: httpStatus.INTERNAL_SERVER_ERROR,},
      message: "all users",
      users: null ,
    });

  }
};

// Get User By ID
userController.findOne = async (req, res) => {
  try {
    let user = await userModel.findById(req.params.userId);
    if (!user) {

      return res.status(httpStatus.BAD_REQUEST).json({ 

        status: {type: "error", code: httpStatus.BAD_REQUEST},
        message: "User not found" ,
        data : null

      });
    }else {

      return res.status(httpStatus.OK).json({ 

        status: {type: "success", code: httpStatus.OK},
        message: "User Data" ,
        data : user

      });

    }
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ 
      status: {type: "error", code: httpStatus.INTERNAL_SERVER_ERROR},
      data : null,
      error: error.toString() 
    });
  }
};

// Update User By ID
userController.update = async (req, res) => {
  try {
    let user = await userModel.findById(req.params.userId);

    if (!user) {

      return res.status(httpStatus.BAD_REQUEST).json({ 

        status: {type: "error", code: httpStatus.BAD_REQUEST},
        message: "User not found" ,
        data : null

      });
    }

    Object.assign(user, req.body);
    await user.save();
    return res.status(httpStatus.OK).json({ 

        status: {type: "success", code: httpStatus.OK},
        message: "User Data" ,
        data : user

    });

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ 

      status: {type: "error", code: httpStatus.INTERNAL_SERVER_ERROR},
      data : null,
      error: error.toString() 

    });
  }
};

// Delete User By ID
userController.delete = async (req, res) => {
  try {
    let user = await userModel.findByIdAndRemove(req.params.userId);
    if (!user) {

      return res.status(httpStatus.BAD_REQUEST).json({ 

        status: {type: "error", code: httpStatus.BAD_REQUEST},
        message: "User not found" ,
        data : null

      });

    }else {
      return res.status(httpStatus.OK).json({ 

        status: {type: "success", code: httpStatus.OK},
        message: "User deleted successfully!" ,

      });
    }
  } catch (error) {

    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ 

      status: {type: "error", code: httpStatus.INTERNAL_SERVER_ERROR},
      data : null,
      error: error.toString() 

    });
    
  }
};

export default userController;
