const { getById } = require("../users/users-model");

function logger(req, res, next) {
  
  const timeStamp = new Date().toLocaleString();
  
  const method = req.method;
  
  const url = req.originalUrl;

  console.log( `At ${timeStamp} ${method} request to ${url}` );
  next();
}

function validateUserId(req, res, next) {
  const {id} = req.params
  try{
  const user = await getById(id);
    if(!user){
      res.status(404).json({ message: "user not found" })
    }else{
      req.user = user;
      next();
    }
  }catch(message){
    res.status(500).json({ error: message })
  }
}

function validateUser(req, res, next) {
  const { name } = req.body;
  if(!name || !name.trim()){
    res.status(400).json({ message: "missing required name field" })
  }else{
    req.name = name.trim()
    next();
  }
}

function validatePost(req, res, next) {
  const { text } = req.body;
  if(!text || !text.trim()){
    res.status(400).json({ message: "missing required text field" })
  }else{
    req.text = text.trim()
    next();
  }
}

// do not forget to expose these functions to other modules
module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost,
}