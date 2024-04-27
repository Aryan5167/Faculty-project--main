import express from "express";
import { approveApplication, createApplication, forwardApplication, getAllApplicationByTag, getAllApplications , getApplicationsByCommenterId, rejectApplication} from "../controllers/applicationNewController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/post", isAuthenticated, createApplication);
router.get("/getall",isAuthenticated,getAllApplications)
router.get("/bycommenter",isAuthenticated,getApplicationsByCommenterId);
router.put("/:applicationId/:commentId/approve",isAuthenticated, approveApplication);
router.put("/:applicationId/:commentId/reject", isAuthenticated, rejectApplication);
router.put('/:applicationId/forward', isAuthenticated, forwardApplication);
router.get("/getalltag",isAuthenticated,getAllApplicationByTag)



export default router;
