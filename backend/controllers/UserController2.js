import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { sendToken } from "../utils/jwtToken.js";

export const register = catchAsyncErrors(async (req, res, next) => {
  const { name,email, password, role } = req.body;


  if (!name || !email  || !password || !role ) {
    return next(new ErrorHandler("Please fill full form!"));
  }

  let requiredFields;
  if (role === 'Student') {
    requiredFields = ['enrollNum', 'year', 'batch'];
  } else if (role === 'Faculty') {
    requiredFields = ['department', 'cabinNumber','level'];
  } else {
    return next(new ErrorHandler("Invalid role!"));
  }

  // Check if required fields are provided
  for (const field of requiredFields) {
    if (!req.body[field]) {
      return next(new ErrorHandler(`Please provide ${field}.`));
    }
  }

  const isEmail = await User.findOne({ email });
  if (isEmail) {
    return next(new ErrorHandler("Email already registered!"));
  }
  const user = await User.create({
    name,
    email,
    password,
    role,
    enrollNum: req.body.enrollNum,
    year: req.body.year,
    batch: req.body.batch,
    department: req.body.department,
    cabinNumber: req.body.cabinNumber,
    level:req.body.level
  });
  sendToken(user, 201, res, "User Registered!");
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return next(new ErrorHandler("Please provide email ,password and role."));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email Or Password.", 400));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email Or Password.", 400));
  }
  if (user.role !== role) {
    return next(
      new ErrorHandler(`User with provided email and ${role} not found!`, 404)
    );
  }
  sendToken(user, 201, res, "User Logged In!");
});

export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Logged Out Successfully.",
    });
});


export const getUser = catchAsyncErrors((req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

export const getFacultyList = catchAsyncErrors(async (req, res, next) => {
  try {
    // Find all users with role 'Faculty'
    const faculty = await User.find({ role: "Faculty" }, "name");
    res.status(200).json({ success: true, faculty });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

