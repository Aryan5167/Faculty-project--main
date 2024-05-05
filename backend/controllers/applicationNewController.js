import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { ApplicationNew } from "../models/ApplicationNewSchema.js";
import {Comment} from "../models/commentSchema.js"
import ErrorHandler from "../middlewares/error.js";

// Controller to create a new application
export const createApplication = catchAsyncErrors(async (req, res, next) => {
  const { subject, content,initial,taggerId,applicationType} = req.body;

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
      applicationType,
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

    const modifiedApplications = applications.map(application => {
      const comment = comments.find(comment => String(comment.applicationId) === String(application._id));
      if (comment) {
        return { ...application.toObject(), isViewed: comment.isViewed };
      } else {
        return application.toObject();
      }
    });
    res.status(200).json({
      success: true,
      count: modifiedApplications.length,
      // count: applications.length,
      // applications,
      applications: modifiedApplications,
    });
  } catch (error) {
    console.log(userId)
    return next(new ErrorHandler(error.message, 500));
  }
});

export const getNoticeApplications=catchAsyncErrors(async(req,res,next)=>{
  try{
    const Myapplications=await ApplicationNew.find({applicationType:"Notice", status:"Approved"});
    res.status(200).json({applications:Myapplications})
  }
  catch(error){
    res.status(500).json({ message: "Failed to fetch Notices" });
  }
 
})


export const getMyApplications =catchAsyncErrors(async(req,res,next)=>{
  try { 
    const myApplications = await ApplicationNew.find({ creatorId: req.user._id });
    res.status(200).json({ applications:myApplications });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch applications" });
  }
})


export const getCommentByApplication = catchAsyncErrors(async (req, res, next) => {
  try {
    const comments = await Comment.find({ applicationId: req.params.applicationId })
      .populate('commenterId', 'name'); // Populate the commenterId field from the User model and include only the 'name' field

    // Map through the comments array to extract the commenter's name and format the date
    const formattedComments = comments.map(comment => {
      // Extract the commenter's name
      const commenterName = comment.commenterId.name;

      // Format the date of action to yyyy-mm-dd format with time
      const dateOfAction = comment.dateOfAction.toISOString().split('T')[0];
      const time = comment.dateOfAction.toISOString().split('T')[1].split('.')[0];
      const formattedDateOfAction = `${dateOfAction} ${time}`;


      return {
        _id: comment._id,
        applicationId: comment.applicationId,
        senderId: comment.senderId,
        tagId: comment.tagId,
        comment: comment.comment,
        status: comment.status,
        isViewed: comment.isViewed,
        dateOfAction: formattedDateOfAction,
        commenterName: commenterName // Extract the commenter's name
      };
    });

    res.status(200).json({ comments: formattedComments });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch comments" });
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
        $lookup: {
          from: "users", // The name of the user collection
          localField: "creatorId", // Field from the application schema
          foreignField: "_id", // Field from the user schema
          as: "creator", // Alias for the joined creator
        },
      },
      {
        $match: {
          "comments.commenterId": userId, // Match comments by commenter ID
        },
      },
    ]);

    const modifiedApplications = applications.map(application => {
      const comment = application.comments.find(comment => String(comment.commenterId) === String(userId));
      if (comment) {
        return { ...application, isViewed: comment.isViewed, creatorName: application.creator[0].name };
      } else {
        return application;
      }
    });

    res.status(200).json({
      success: true,
      count: modifiedApplications.length,
      applications: modifiedApplications,
      // count: applications.length,
      // applications,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

export const approveNoticeApplication = async (req, res, next) => {
  try {
      const { applicationId } = req.params;

      // Update application status to 'approved'
      await ApplicationNew.findByIdAndUpdate(applicationId, { isNotice: true, noticeStatus:"Approved"});

      // Update comment status to 'approved'
      // await Comment.findByIdAndUpdate(commentId, { status: 'approved',isViewed:true });

      res.status(200).json({ success:true,message: 'Notice application approved successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Failed to approve notice application' });
  }
};

export const rejectNoticeApplication = async (req, res, next) => {
  try {
      const { applicationId } = req.params;

      // Update application status to 'rejected'
      await ApplicationNew.findByIdAndUpdate(applicationId, { isNotice:true,noticeStatus:"Rejected"});

      // Update comment status to 'rejected'
      // await Comment.findByIdAndUpdate(commentId, { status: 'rejected',isViewed:true });

      res.status(200).json({ message: 'Notice application rejected successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Failed to reject notice application' });
  }
};

export const approveApplication = async (req, res, next) => {
  const { applicationId, commentId } = req.params;

  try {
    // Update status to "Approved" in the application schema
    await ApplicationNew.findByIdAndUpdate(applicationId, { status: "Approved" });

    // Update status to "Approved" in the corresponding comment schema
    await Comment.findByIdAndUpdate(commentId, { status: "Approved",isViewed:true});

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
    await Comment.findByIdAndUpdate(commentId, { status: "Rejected",isViewed:true});

    res.status(200).json({
      success: true,
      message: "Application rejected successfully!",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};
export const withDrawApplication = async (req, res, next) => {
  const { applicationId } = req.params;

  try {
    // Update status to "Withdrawn" in the application schema
    await ApplicationNew.findByIdAndUpdate(applicationId, { status: "Withdrawn" });

    res.status(200).json({
      success: true,
      message: "Application withdrawn successfully!",
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
      { senderId: recipientId, comment: comment, status: 'pending',isViewed:true}
    );

    // Create a new comment for the forwarded application
    const newComment = new Comment({
      applicationId: applicationId,
      commenterId: recipientId,
      senderId: null, // Assuming you want to reset recipientId for the new comment
      status: 'Pending'
    });
    await newComment.save();
    // await ApplicationNew.findByIdAndUpdate(applicationId, { status: 'forwarded',isViewed:true });
    res.status(200).json({ success: true, message: 'Application forwarded successfully' });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
};


export const getDepartmentApplicationsForHOD = catchAsyncErrors(async (req, res, next) => {
  try {
    // const department = req.user.department; // Assuming department is stored in user object
    const department=req.params.department
    const departmentApplications = await ApplicationNew.aggregate([
      {
        $lookup: {
          from: "users", // Name of the User collection
          localField: "creatorId",
          foreignField: "_id",
          as: "creator"
        }
      },
      {
        $lookup: {
          from: "users", // Name of the User collection
          localField: "initial",
          foreignField: "_id",
          as: "initialUser"
        }
      },
      {
        $match: {
          $or: [
            { "creator.department": department },
            { "initialUser.department": department }
          ]
        }
      }
    ]);
    
    res.status(200).json({ departmentApplications });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch applications" });
  }
});

export const getAllApplicationsForDean = catchAsyncErrors(async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      throw new ErrorHandler("User information not found in request.", 400);
    }
    const allApplications = await ApplicationNew.find();
    res.status(200).json({
      success: true,
      count: allApplications.length,
      allApplications,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch applications" });
  }
});

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

export const changeApplicationStatus = async (req, res, next) => {
  const { applicationId } = req.params;
  //  const { status } = req.body;

  try {
    // Find the application by ID
    const application = await ApplicationNew.findById(applicationId);

    // Check if the application exists
    if (!application) {
      return next(new ErrorHandler("Application not found", 404));
    }

    // Update the status of the application
    application.status = "alert";
    await application.save();

    // Respond with success message
    res.status(200).json({ success: true, message: "Application status updated successfully" });
  } catch (error) {
    // Handle errors
    return next(new ErrorHandler(error.message, 500));
  }
};

// Other controller functions for updating, deleting, and retrieving applications can be added here
