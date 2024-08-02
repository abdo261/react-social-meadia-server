const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const {
  validateRegisterUser,
  validateLoginUser,
} = require("../validation/auth");
const User = require("../models/User");
const Profile = require("../models/Profile");
const { formatError } = require("../utils/utils");

require('dotenv').config()
const register = async (req, res) => {
  try {
    const { user_name, email, password } = req.body;
    const { error } = validateRegisterUser({ user_name, email, password });
    if (error) {
      return res.status(400).json({ message: formatError(error) });
    }
    const ExistUser = await User.findOne({ email });
    if (ExistUser) {
      return res.status(404).json({ message: {email:["email already taken  !"] }});
    }
    const hashPassword = await bcryptjs.hash(password, +process.env.POWER_HASH);
    const user = new User({ user_name, email, password: hashPassword });
    await user.save();

    const profile = new Profile({ user: user._id });
    await profile.save();

    const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);

    res.status(201).json({
      token,
      message: "You are registered successfully. Welcome!",
      user: { _id:user._id,user_name, email,profile },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { error } = validateLoginUser({ email, password });
    if (error) {
      return res.status(400).json({ message: formatError(error) });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "email or password incorrect !" });
    }
    const isPassword = await bcryptjs.compare(password, user.password);
    if (!isPassword) {
      return res.status(404).json({ message: "email or password incorrect !" });
    }
    const profile = await Profile.findOne({ user: user._id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found!" });
    }

    const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);
    res.status(201).json({
      token,
      message: "You are login successfully. Welcome back!",
      user: {_id:user._id, user_name: user.user_name, email,profile },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { register, login };
