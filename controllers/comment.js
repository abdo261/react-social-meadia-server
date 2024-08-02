const Comment = require("../models/Comment");
const { formatError } = require("../utils/utils");
const validateCreateComment = require("../validation/comment");
const User = require('../models/User');
const Profile = require('../models/Profile');


const getCommentsWithUserProfiles = async (req, res) => {
  try {
    const { ids } = req.body;

    // Validate input
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Invalid input: ids should be a non-empty array' });
    }

    // Fetch comments with their user and user profile details
    const comments = await Comment.find({ _id: { $in: ids } })
      .populate({
        path: 'user',
        select: 'user_name', // Exclude email and password
        populate: {
          path: 'profile',
          select: 'image' // Include only the image field from the profile
        }
      });

    // Check if comments are found
    if (!comments.length) {
      return res.status(404).json({ message: 'No comments found' });
    }

    // Transform comments to include profile image directly within user object
    const transformedComments = comments.map(comment => {
      const user = comment.user;
      const profileImage = user.profile ? user.profile.image : null;

      return {
        ...comment.toObject(),
        user: {
          ...user.toObject(),
          profileImage
        }
      };
    });

    // Return the comments with populated user and profile data
    res.status(200).json(transformedComments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const create = async (req, res) => {
  if (!req._id) {
    return res.status(400).json({ message: "You should connect first." });
  }
  try {
    const { content } = req.body;
    const { error } = validateCreateComment({ content });
    if (error) {
      return res.status(400).json({ message: formatError(error) });
    }
    const comment = new Comment({
      content,
      user: req._id,
      post: req.params.post,
    });
    await comment.save();
    res
      .status(201)
      .json({ message: "you have comented succefely to the post" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { create,getCommentsWithUserProfiles };
