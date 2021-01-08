import express from "express";
import userController from "./user.controller";
import { asyncWrapper } from "../../utils/asyncWrapper";
import authenticateToken from "../../middleware/auth";
import isAdmin from "../../middleware/isAdmin";
import onlyOwner from "../../middleware/onlyOwner";
import onlyMe from "../../middleware/onlyMe";



const userRoutes = express.Router();

userRoutes.get("/", function(req, res, next) {
  res.json({ message: "from index api" });
});

// Create
userRoutes.post("/register", asyncWrapper(userController.register));

// Login
userRoutes.post("/login", asyncWrapper(userController.login));

// Login
userRoutes.get("/activate/:activation", asyncWrapper(userController.activate));

//GetAll Data
userRoutes.get("/users",[authenticateToken, isAdmin],asyncWrapper(userController.findAll));

//GetBy ID
userRoutes.get("/users/:userId",[authenticateToken, onlyOwner],asyncWrapper(userController.findOne));
// if admin can see all single user data
// else only your data

//update by ID
userRoutes.put("/users/:userId",[authenticateToken, onlyMe],asyncWrapper(userController.update));

//Delete
userRoutes.delete("/users/:userId",[authenticateToken],asyncWrapper(userController.delete));

export { userRoutes };
