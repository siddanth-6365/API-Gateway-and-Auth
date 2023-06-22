const express = require("express");
const { InfoController, UserController } = require("../../controllers");
const { usermiddleware } = require("../../middlewares");

const router = express.Router();

/**
 * POST : /signup
 * req-body {email: 'a@b.com', password: '1234'}
 */

router.post(
  "/signup",
  usermiddleware.validateAuthRequest,
  UserController.signup
);
router.post(
  "/signin",
  usermiddleware.validateAuthRequest,
  UserController.signin
);

module.exports = router;
