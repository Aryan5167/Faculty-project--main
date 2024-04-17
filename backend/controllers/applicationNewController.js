import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { ApplicationNew } from "../models/ApplicationNewSchema.js";
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

    res.status(200).json({
      success: true,
      message: "Application created successfully!",
      application,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});


export const getAllApplications = catchAsyncErrors(async (req, res, next) => {
    try {
      // Retrieve all applications from the database
      const applications = await ApplicationNew.find();
  
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
