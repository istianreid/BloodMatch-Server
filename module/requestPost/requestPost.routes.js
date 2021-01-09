import express from "express";
import requestPostController from "./requestPost.controller";
import { asyncWrapper } from "../../utils/asyncWrapper";
import authenticateToken from "../../middleware/auth";
import isAdmin from "../../middleware/isAdmin";
import onlyOwner from "../../middleware/onlyOwner";

import path from 'path'
import multer from 'multer'

const requestPostRoutes = express.Router();

// add a requestPost
requestPostRoutes.post(
  "/",
  [authenticateToken],
  asyncWrapper(requestPostController.add)
);

// view all 
requestPostRoutes.get(
  "/", [authenticateToken], 
  asyncWrapper(requestPostController.findAll));


// view one requestPost
requestPostRoutes.get(
  "/:requestPostId",
  [authenticateToken],
  asyncWrapper(requestPostController.findOne)
);

// update a requestPost
requestPostRoutes.put(
  "/:requestPostId",
  [authenticateToken],
  asyncWrapper(requestPostController.update)
);

// delete a requestPost
requestPostRoutes.delete(
  "/:requestPostId",
  [authenticateToken,isAdmin],
  asyncWrapper(requestPostController.delete)
);

// upload 
//////////////////////////////////////////////////////////


const storage = multer.diskStorage({ 
  destination(req, file, cb){
      cb(null, 'uploads/')
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


// requestPostRoutes.post(
//   "/uploadPost",
//   [authenticateToken],
//   upload.single('image'),
//   asyncWrapper(requestPostController.add)
// );

requestPostRoutes.post('/uploadPost',
  [authenticateToken], 
  upload.single('image'), (req, res) => {
  res.send(`${req.file.filename}`)
})

export { requestPostRoutes };
