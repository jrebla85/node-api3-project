const express = require('express');
const Users = require("./users-model");
const Posts = require("../posts/posts-model");

const { 
  validateUserId,
  validateUser,
  validatePost,
 } = require("../middleware/middleware");

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();

router.get('/', (req, res, next) => {
  Users.get()
  .then(users => res.status(200).json(users))
  .catch(next)
});

router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json(req.user)
});

router.post('/', validateUser, (req, res, next) => {
  Users.insert({ name: req.name})
  .then(newUser => {
    res.status(201).json(newUser)
  })
  .catch(next)
});

router.put('/:id', validateUserId, validateUser, (req, res, next) => {
  Users.update(req.params.id, { name: req.name })
  .then(() => { 
    return Users.getById(req.params.id)
  })
  .then(user => {
    res.status(200).json(user)
  })
  .catch(next)
});

router.delete('/:id', validateUserId, async (req, res, next) => {
  try{
    await Users.remove(req.params.id);
    res.json(req.user)
  }catch(err){
    next(err);
  }
});

router.get('/:id/posts', validateUserId, async (req, res, next) => {
  const {id} = req.params
  try{
    const result = await Users.getUserPosts(id);
    res.status(200).json(result)
  }catch(err){
    next(err)
  }
});

router.post('/:id/posts', validateUserId, validatePost, async (req, res, next) => {
  const {id} = req.params
  try{
    const result = await Posts.insert({user_id: id, text: req.text});
    res.status(201).json(result)
  }catch(err){
    next(err)
  }
});

router.use((err, req, res, next) => { //eslint-disable-line
  res.status(err.status || 500).json({
    customMessage: "Something died and we could not complete your request :(",
    message: err.message,
    stack: err.stack,
  })
})

// do not forget to export the router
module.exports = router;
