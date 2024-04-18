import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { ApplicationNew } from "../models/ApplicationNewSchema.js";
import {Comment} from "../models/commentSchema.js"
import ErrorHandler from "../middlewares/error.js";

// Controller to create a new application
export const createApplication = catchAsyncErrors(async (req, res, next) => {
  const { subject, content,initial} = req.body;

  // Validate input fields
  if (!subject || !content ) {
    return next(new ErrorHandler("Please provide all application details.", 400));
  }

  // Get the ID of the user creating the application
  const creatorId = req.user._id;

  try {
    // Create the application
    const application = await ApplicationNew.create({
      subject,
      content,
      initial,
      creatorId,
    });

    const comment = await Comment.create({
      commenterId: initial, // Set commenterId to the initial received in req.body
      applicationId: application._id, // Set applicationId to the ID of the created application
      status: 'Pending', // Set status to Pending by default
    });

    res.status(200).json({
      success: true,
      message: "Application created successfully!",
      application,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});


export const getApplicationsByCommenterId = catchAsyncErrors(async (req, res, next) => {
  

  try {

    const userId  = req.user._id;
    // Retrieve comments where commenterId matches the current user's id
    const comments = await Comment.find({ commenterId: userId });

    // Extract applicationIds from comments
    const applicationIds = comments.map(comment => comment.applicationId);

    // Retrieve applications corresponding to the extracted applicationIds
    const applications = await ApplicationNew.find({ _id: { $in: applicationIds } });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.log(userId)
    return next(new ErrorHandler(error.message, 500));
  }
});


export const getAllApplications = catchAsyncErrors(async (req, res, next) => {
 
  try {

    if (!req.user || !req.user._id) {
      throw new ErrorHandler("User information not found in request.", 400);
    }

    const userId  = req.user._id;
      // Retrieve all applications from the database
      const comments = await Comment.find({ commenterId: userId });

      // Extract applicationIds from comments
      const applicationIds = comments.map(comment => comment.applicationId);
  
      // Retrieve applications corresponding to the extracted applicationIds
      const applications = await ApplicationNew.find({ _id: { $in: applicationIds } });
  
      res.status(200).json({
        success: true,
        count: applications.length,
        applications,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

// Other controller functions for updating, deleting, and retrieving applications can be added here
