import express from "express";
import { createApplication, getAllApplications , getApplicationsByCommenterId} from "../controllers/applicationNewController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/post", isAuthenticated, createApplication);
router.get("/getall",isAuthenticated,getAllApplications)
router.get("/bycommenter",isAuthenticated,getApplicationsByCommenterId);


export default router;
