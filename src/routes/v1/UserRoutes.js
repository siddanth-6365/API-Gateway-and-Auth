const express = require('express');
const { InfoController,UserController } = require('../../controllers');


const router = express.Router();

/**
 * POST : /signup 
 * req-body {email: 'a@b.com', password: '1234'}
 */

router.post('/signup', UserController.signup);
router.post('/signin', UserController.signin);


module.exports = router;