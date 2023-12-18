import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import ErrorResponse from '../utils/errorResponse.js';  

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      throw new ErrorResponse('Please provide username, email, and password', 400);
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: passwordHash,
    });

    const user = await newUser.save();

    // generate jwt token using function
    const token = generateToken(user._id);

    const userData = { _id: user._id, username: user.username, email: user.email };
    res.status(200).json({ token, user: userData });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      throw new ErrorResponse('Please provide an email and password', 400);
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new ErrorResponse('Invalid credentials', 401);
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ErrorResponse('Invalid credentials', 401);
    }

    // Send token to client
    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

const sendTokenResponse = (user, statusCode, res) => {
  // Create and sign JWT token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
};
