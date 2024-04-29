// applicationRouter.js
// const express = require('express');
// import express from "express";
// const router = express.Router();


import express from 'express';
import { createApplication } from '../controllers/trialController.js';
import { isAuthenticated } from "../middlewares/auth.js";
const router = express.Router();
// const applicationController = require('../controllers/trialController');

// POST route to create a new application
router.post('/post', isAuthenticated,createApplication);

// module.exports = router;
export default router;