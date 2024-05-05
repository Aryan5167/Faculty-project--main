import express from "express";
import { approveApplication, createApplication,rejectNoticeApplication,changeApplicationStatus, forwardApplication,approveNoticeApplication,getAllApplicationsForDean,getNoticeApplications,getDepartmentApplicationsForHOD, getAllApplicationByTag, getAllApplications , getMyApplications, getApplicationsByCommenterId, rejectApplication, withDrawApplication,getCommentByApplication} from "../controllers/applicationNewController.js";
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
router.get("/getDepartmentApplications/:department",isAuthenticated,getDepartmentApplicationsForHOD)
router.get("/getallfordean",isAuthenticated,getAllApplicationsForDean)
router.get("/getNoticeApplications",isAuthenticated,getNoticeApplications)
// Route to approve a notice application
router.put('/:applicationId/approveNotice', isAuthenticated,approveNoticeApplication);

// Route to reject a notice application
router.put('/:applicationId/rejectNotice', isAuthenticated,rejectNoticeApplication);

router.put("/changeStatus/:applicationId",isAuthenticated,changeApplicationStatus)

export default router;
