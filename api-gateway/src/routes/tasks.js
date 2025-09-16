const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');

// This is a protected route. 
// The `verifyToken` middleware will run before the route handler.
router.get('/', verifyToken, (req, res) => {
  // The user's information, decoded from the JWT, is available in req.user
  res.status(200).send(`Welcome user ${req.user.email}! This is the protected tasks route.`);
});

// We can add more task-related routes here, like:
// router.post('/', verifyToken, createTask);
// router.put('/:id', verifyToken, updateTask);
// router.delete('/:id', verifyToken, deleteTask);


module.exports = router; 