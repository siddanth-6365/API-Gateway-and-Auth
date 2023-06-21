const express = require('express');
const { UserController } = require('../../controllers');

const router = express.Router();

/**
 * POST : /signup 
 * req-body {email: 'a@b.com', password: '1234'}
 */

router.post('/', UserController.signup);

module.exports = router;