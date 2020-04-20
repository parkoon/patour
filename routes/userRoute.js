const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.patch('/resetPassword/:token', authController.resetPassword);
router.post('/forgotPassword', authController.forgotPassword);

router
  .route('/:id')
  .get(userController.getUser)
  .delete(userController.deleteUser)
  .patch(userController.updateUser);
router.route('/').post(userController.createUser).get(userController.getUsers);

module.exports = router;
