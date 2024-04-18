import mongoose from "mongoose"
// const User=require('./userSchema')
// const Application=require('./ApplicationNewSchema')

const commentSchema = new mongoose.Schema({
  commenterId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref:'User'
  },
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  tagId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  comment: {
    type: String,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    required: true
  },
  isViewed: {
    type: Boolean,
    default: false
  },
  dateOfAction: {
    type: Date,
    default: Date.now
  }
});

export const Comment = mongoose.model("Comment", commentSchema);