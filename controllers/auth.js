const User = require('../models/User')
const ErrorResponse = require("../utils/errorResponse")

// @desc    Register user
exports.register = async (req, res, next) => {
    const { username, email, phonenumber, password } = req.body;
  
    try {
      const user = await User.create({
        username,
        email,
        phonenumber,
        password,
      });
  
      sendToken(user, 200, res);
    } catch (err) {
      next(err);
    }
  };

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


exports.forgotpassword = (req, res, next) => {
    res.send('Forgot Password Route')
};
exports.resetpassword = (req, res, next) => {
    res.send('Reset Password Route')
}

const sendToken = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();
    res.status(statusCode).json({ sucess: true, token });
  };