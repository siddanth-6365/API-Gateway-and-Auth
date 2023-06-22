const express = require('express');
const { authrequestmiddlewares } = require("../../middlewares");

const { InfoController,UserController } = require('../../controllers');
const UserRoutes = require('./UserRoutes')

const router = express.Router();

router.get('/info', authrequestmiddlewares.checkAuth, InfoController.info);

router.use('/user', UserRoutes);




module.exports = router;