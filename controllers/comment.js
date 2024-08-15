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
        select: 'user_name', 
        populate: {
          path: 'profile',
          select: 'image'
        }
      });

    // Check if comments are found
    if (!comments.length) {
      return res.status(404).json({ message: 'No comments found' });
    }

    // Transform comments to include profile image directly within user object
    const transformedComments = comments.map(comment => {
      if (!comment.user) {
        // Handle the case where the user is null
        return {
          ...comment.toObject(),
          user: null
        };
      }

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
const getCommentsByPostId = async (req, res) => {
  try {
    const { postId } = req.params; // Assuming you're sending the postId in the request params

    // Validate input
    if (!postId) {
      return res.status(400).json({ message: 'Invalid input: postId is required' });
    }

    // Fetch comments for the given post ID
    const comments = await Comment.find({ post: postId }).lean(); // .lean() to return plain JavaScript objects

    if (!comments.length) {
      return res.status(404).json({ message: 'No comments found for this post' });
    }

    // Extract user IDs from comments
    const userIds = comments.map(comment => comment.user).filter(Boolean);

    if (userIds.length === 0) {
      return res.status(200).json(comments.map(comment => ({ ...comment, user: null })));
    }

    // Fetch users with their profiles
    const users = await User.find({ _id: { $in: userIds } })
      .select('user_name')
      // .populate({
      //   path: 'profile',
      //   select: 'image'
      // })
      // .lean();
console.log(users)
    // Create a map for users by their IDs
    const userMap = users.reduce((map, user) => {
      map[user._id] = {
        user_name: user.user_name,
        profileImage: user.profile ? user.profile.image : null
      };
      return map;
    }, {});

    // Merge comments with user data
    const transformedComments = comments.map(comment => {
      const user = userMap[comment.user] || null;

      return {
        ...comment,
        user
      };
    });

    // Return the comments with populated user data
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
      .json({ message: "you have comented succefely to the post",comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { create,getCommentsWithUserProfiles,getCommentsByPostId };
