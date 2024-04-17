import mongoose from "mongoose";
import validator from "validator";

// const User = require('./User'); // Importing the User model

const applicationSchema = new mongoose.Schema({
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  subject: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  dateOfCreation: { type: Date, default: Date.now },
  terminationDate: { type: Date },
  terminationId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  initial: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Array of user ids who viewed the application
});

export const ApplicationNew = mongoose.model("ApplicationNew", applicationSchema);