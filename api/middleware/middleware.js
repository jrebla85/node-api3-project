const { getById } = require("../users/users-model");

function logger(req, res, next) {
  console.log({ Method: req.method, URL: req.url, Date: (new Date()).toISOString() });
  next();
}

function validateUserId(req, res, next) {
  const {id} = req.params
  getById(id)
  .then(user => {
    if(!user){
      res.status(404).json({ message: "user not found" })
    }else{
      req.user = user;
      next();
    }
  })
}

function validateUser(req, res, next) {
  // DO YOUR MAGIC
}

function validatePost(req, res, next) {
  // DO YOUR MAGIC
}

// do not forget to expose these functions to other modules
module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost,
}