import express from "express";
import { approveApplication, createApplication, forwardApplication, getAllApplicationByTag, getAllApplications , getMyApplications, getApplicationsByCommenterId, rejectApplication, withDrawApplication,getCommentByApplication} from "../controllers/applicationNewController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/post", isAuthenticated, createApplication);
router.get("/getall",isAuthenticated,getAllApplications)
router.get("/bycommenter",isAuthenticated,getApplicationsByCommenterId);
router.put("/:applicationId/:commentId/approve",isAuthenticated, approveApplication);
router.put("/:applicationId/:commentId/reject", isAuthenticated, rejectApplication);
router.put("/:applicationId/withdraw", isAuthenticated, withDrawApplication);
router.put('/:applicationId/forward', isAuthenticated, forwardApplication);
router.get("/getalltag",isAuthenticated,getAllApplicationByTag)
router.get("/getMyApplications",isAuthenticated,getMyApplications)
router.get("/getCommentsByApplication/:applicationId",isAuthenticated,getCommentByApplication)



export default router;
