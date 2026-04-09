const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (userId, res) => {
  const JWT_SECRET = process.env.JWT_SECRET || 'secret123';
  const token = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "Development",
  });

  return token;
};

// --------------------- SIGNUP ---------------------
exports.signup = async (req, res) => {
  try {
    const { username, fullName, email, password } = req.body;
    const targetName = fullName || username;

    if (!targetName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName: targetName,
      email,
      password: hashedPassword
    });

    const savedUser = await newUser.save();
    generateToken(savedUser._id, res);

    res.status(201).json({
      message: 'User created successfully',
      _id: savedUser._id,
      fullName: savedUser.fullName,
      email: savedUser.email,
      profilePic: savedUser.profilePic,
    });
  } catch (err) {
    console.error("Error in signup controller:", err);
    res.status(500).json({ message: 'Server error' });
  }
};

// --------------------- LOGIN ---------------------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    generateToken(user._id, res);

    res.status(200).json({
      message: 'Login successful',
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (err) {
    console.error("Error in login controller:", err);
    res.status(500).json({ message: 'Server error' });
  }
};

// --------------------- LOGOUT ---------------------
exports.logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error("Error in logout controller:", err);
    res.status(500).json({ message: 'Server error' });
  }
};