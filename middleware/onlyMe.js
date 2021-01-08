function onlyMe(req, res, next) {
  if (req.params.userId == req.user.userId) {
    next();
  } 
  else {
    res.sendStatus(403);
  }
}

export default onlyMe;
