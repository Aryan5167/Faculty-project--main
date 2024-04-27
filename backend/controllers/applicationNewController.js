import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { ApplicationNew } from "../models/ApplicationNewSchema.js";
import {Comment} from "../models/commentSchema.js"
import ErrorHandler from "../middlewares/error.js";

// Controller to create a new application
export const createApplication = catchAsyncErrors(async (req, res, next) => {
  const { subject, content,initial,taggerId} = req.body;

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
      tagId:taggerId,
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

    const userId = req.user._id;

    // Retrieve all applications with corresponding comment IDs
    const applications = await ApplicationNew.aggregate([
      {
        $lookup: {
          from: "comments", // The name of the comment collection
          localField: "_id", // Field from the application schema
          foreignField: "applicationId", // Field from the comment schema
          as: "comments", // Alias for the joined comments
        },
      },
      {
        $match: {
          "comments.commenterId": userId, // Match comments by commenter ID
        },
      },
    ]);

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

export const approveApplication = async (req, res, next) => {
  const { applicationId, commentId } = req.params;

  try {
    // Update status to "Approved" in the application schema
    await ApplicationNew.findByIdAndUpdate(applicationId, { status: "Approved" });

    // Update status to "Approved" in the corresponding comment schema
    await Comment.findByIdAndUpdate(commentId, { status: "Approved" });

    res.status(200).json({
      success: true,
      message: "Application approved successfully!",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// Reject an application and update corresponding comment
export const rejectApplication = async (req, res, next) => {
  const { applicationId, commentId } = req.params;

  try {
    // Update status to "Rejected" in the application schema
    await ApplicationNew.findByIdAndUpdate(applicationId, { status: "Rejected" });

    // Update status to "Rejected" in the corresponding comment schema
    await Comment.findByIdAndUpdate(commentId, { status: "Rejected" });

    res.status(200).json({
      success: true,
      message: "Application rejected successfully!",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

export const forwardApplication = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const { recipientId, comment } = req.body;

    // Update the comment associated with the application
    await Comment.findOneAndUpdate(
      { applicationId: applicationId, commenterId: req.user._id },
      { senderId: recipientId, comment: comment, status: 'Pending',isViewed:true }
    );

    // Create a new comment for the forwarded application
    const newComment = new Comment({
      applicationId: applicationId,
      commenterId: recipientId,
      senderId: null, // Assuming you want to reset recipientId for the new comment
      status: 'Pending'
    });
    await newComment.save();

    res.status(200).json({ success: true, message: 'Application forwarded successfully' });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
};

export const getAllApplicationByTag = catchAsyncErrors(async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      throw new ErrorHandler("User information not found in request.", 400);
    }

    const userId = req.user._id;

    // Retrieve all applications with corresponding comment IDs
    const applications = await ApplicationNew.aggregate([
      {
        $lookup: {
          from: "comments", // The name of the comment collection
          localField: "_id", // Field from the application schema
          foreignField: "applicationId", // Field from the comment schema
          as: "comments", // Alias for the joined comments
        },
      },
      {
        $match: {
          "comments.tagId": userId, // Match comments by commenter ID
        },
      },
    ]);

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