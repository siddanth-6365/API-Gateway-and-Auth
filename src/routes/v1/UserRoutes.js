const express = require("express");
const { InfoController, UserController } = require("../../controllers");
const { authrequestmiddlewares } = require("../../middlewares");

const router = express.Router();

/**
 * POST : /signup
 * req-body {email: 'a@b.com', password: '1234'}
 */

router.post(
  "/signup",
  authrequestmiddlewares.validateAuthRequest,
  UserController.signup
);
router.post(
  "/signin",
  authrequestmiddlewares.validateAuthRequest,
  UserController.signin
);

router.post('/role',authrequestmiddlewares.checkAuth, authrequestmiddlewares.isAdmin, UserController.addRoleToUser);

module.exports = router;
