const User = require('../models/User')
const ErrorResponse = require("../utils/errorResponse")
const AddFriend = require("../models/AddFriend");

// @desc    Register user
exports.register = async (req, res, next) => {
    const { fullName, email, phoneNumber, password } = req.body;
  
    try {
      const user = await User.create({
        fullName,
        email,
        phoneNumber,
        password,
      });
  
      sendToken(user, 200, res);
      // await addDocument(res._id)
    } catch (err) {
      next(err);
    }
  };

const addDocument = async (userId) => {
    const friendId = userId
    await AddFriend.create({
        userId,
        friends: [{friendId}],
        requests: []
    });
}

  // @desc    Login user
exports.login = async (req, res, next) => {
    const { email, password } = req.body;
  
    // Check if email and password is provided
    if (!email || !password) {
      return next(new ErrorResponse("Please provide an email and password", 400));
    }
  
    try {
      // Check that user exists by email
      const user = await User.findOne({ email }).select("+password");
  
      if (!user) {
        return next(new ErrorResponse("Invalid credentials", 401));
      }
  
      // Check that password match
      const isMatch = await user.matchPasswords(password);
  
      if (!isMatch) {
        return next(new ErrorResponse("Invalid credentials", 401));
      }
  
      sendToken(user, 200, res);
    } catch (err) {
      next(err);
    }
  };


exports.forgotPassword = (req, res, next) => {
    res.send('Forgot Password Route')
};
exports.resetPassword = (req, res, next) => {
    res.send('Reset Password Route')
}

const sendToken = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();
    res.status(statusCode).json({ success: true, token });
  };