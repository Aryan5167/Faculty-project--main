import express from "express";
import { createApplication, getAllApplications } from "../controllers/applicationNewController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/post", isAuthenticated, createApplication);
router.get("/getall",getAllApplications)


export default router;
