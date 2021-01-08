function onlyOwner(req, res, next) {
  if (req.user.role == "admin") {
    next();
  } else if (
    req.user.role == "member" &&
    req.params.userId == req.user.userId
  ) {
    next();
  } else {
    res.sendStatus(403);
  }
}

export default onlyOwner;
