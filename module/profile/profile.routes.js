import express from "express";
import profileController from "./profile.controller";
import { asyncWrapper } from "../../utils/asyncWrapper";
import authenticateToken from "../../middleware/auth";
import isAdmin from "../../middleware/isAdmin";
import onlyOwner from "../../middleware/onlyOwner";

import path from 'path'
import multer from 'multer'

const profileRoutes = express.Router();

// add a profile
profileRoutes.post(
  "/",
  [authenticateToken],
  asyncWrapper(profileController.add)
);

// view all 
profileRoutes.get(
  "/", [authenticateToken], 
  asyncWrapper(profileController.findAll));


// view one profile
profileRoutes.get(
  "/:profileId",
  [authenticateToken],
  asyncWrapper(profileController.findOne)
);

// update a profile
profileRoutes.put(
  "/:profileId",
  [authenticateToken],
  asyncWrapper(profileController.update)
);

// delete a profile
profileRoutes.delete(
  "/:profileId",
  [authenticateToken,isAdmin],
  asyncWrapper(profileController.delete)
);


// upload 
//////////////////////////////////////////////////////////


const storage = multer.diskStorage({ 
  destination(req, file, cb){
      cb(null, 'uploads/profile')
  },
  filename(req, file, cb){
      cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
  }
})

function checkFileType(file, cb){
  const filetypes = /jpg|jpeg|png/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)

  if(extname && mimetype){
     return cb(null, true)
  } else {
      cb('Images only!')
  }
}

const upload = multer({
  storage,
  fileFilter: function(req, file, cb){
      checkFileType(file, cb)
  }
})

profileRoutes.post(
  "/upload/:profileId",
  [authenticateToken],
  upload.single('image'),
  asyncWrapper(profileController.upload)
);

// profileRoutes.post('/uploadPost',
//   [authenticateToken], 
//   upload.single('image'), (req, res) => {
//   res.send(`/${req.file.filename}`)
// })

export { profileRoutes };
