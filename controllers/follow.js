const Follow = require("../models/Follow");
const User = require("../models/User");
const Profile = require("../models/Profile");

const create = async (req, res) => {
  if (!req._id) {
    return res
      .status(401)
      .json({ message: "Please connect first to make a follow" });
  }
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "Recipient user ID is required" });
  }
  try {
    if (req._id === userId) {
      return res.status(400).json({ message: "You cannot follow yourself." });
    }
    const existingFollow = await Follow.findOne({ from: req._id, to:userId });
    if (existingFollow) {
      return res
        .status(400)
        .json({ message: "You are already following this user." });
    }
    const follow = new Follow({ from: req._id, to: userId });
    await follow.save();

    res
      .status(201)
      .json({ message: "You are now following the user successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getUserFollowing = async (req, res) => {
  const { userId } = req.params;

  try {
   
    const follows = await Follow.find({ from: userId }).populate(
      "to",
      "user_name email"
    );

    if (!follows.length) {
      return res
        .status(200)
        .json([]);
    }

   
    const followingUserIds = follows.map((follow) => follow.to._id);
    const profiles = await Profile.find({ user: { $in: followingUserIds } });

   
    const followingUsers = follows.map((follow) => {
      const profile = profiles.find(
        (p) => p.user.toString() === follow.to._id.toString()
      );
      return {
        user: follow.to,
        profile: profile || {},
      };
    });

    res.status(200).json(followingUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserFollowers = async (req, res) => {
  const { userId } = req.params;

  try {
   
    const follows = await Follow.find({ to: userId }).populate(
      "from",
      "user_name email"
    );

    if (!follows.length) {
      return res.status(200).json([]);
    }

  
    const followerUserIds = follows.map((follow) => follow.from._id);
    const profiles = await Profile.find({ user: { $in: followerUserIds } });

   
    const followersUsers = follows.map((follow) => {
      const profile = profiles.find(
        (p) => p.user.toString() === follow.from._id.toString()
      );
      return {
        user: follow.from,
        profile: profile || {},
      };
    });

    res.status(200).json(followersUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { create, getUserFollowing, getUserFollowers };
