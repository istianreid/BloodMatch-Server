import express from "express";
import { userRoutes } from "../../module/user/user.routes";
import { profileRoutes } from "../../module/profile/profile.routes"
import { requestPostRoutes } from "../../module/requestPost/requestPost.routes"



const apiRoutes = express.Router();

apiRoutes.get("/", function(req, res, next) {
  res.json({ message: "BloodMatchAPI" });
});

apiRoutes.use("/auth", userRoutes);
apiRoutes.use("/profile", profileRoutes);
apiRoutes.use("/requestPost", requestPostRoutes);


export default apiRoutes;
