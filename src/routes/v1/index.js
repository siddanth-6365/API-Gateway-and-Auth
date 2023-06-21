const express = require('express');

const { InfoController } = require('../../controllers');
const UserRoutes = require('./UserRoutes')

const router = express.Router();

router.get('/info', InfoController.info);

router.use('/signup', UserRoutes);


module.exports = router;