const Like = require("../models/Like");

const getLikesWithUserProfiles = async (req, res) => {
  try {
    const { ids } = req.body;

    // Validate input
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Invalid input: ids should be a non-empty array' });
    }

    // Fetch likes with their user and user profile details
    const likes = await Like.find({ _id: { $in: ids } })
      .populate({
        path: 'user',
        select: 'user_name', // Exclude email and password
        populate: {
          path: 'profile',
          select: 'image' // Include only the image field from the profile
        }
      });

    // Check if likes are found
    if (!likes.length) {
      return res.status(404).json({ message: 'No likes found' });
    }

    // Transform likes to include profile image directly within user object
    const transformedLikes = likes.map(like => {
      const user = like.user;
      const profileImage = user.profile ? user.profile.image : null;

      return {
        ...like.toObject(),
        user: {
          ...user.toObject(),
          profileImage
        }
      };
    });

    // Return the likes with populated user and profile data
    res.status(200).json(transformedLikes);
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
      
      const like = await Like.findOneAndDelete({ user: req._id, post: req.params.post });
      if (like) {
        return res.status(200).json({ message: "You disliked the post." });
      }

      const newLike = new Like({ user: req._id, post: req.params.post });
      await newLike.save();
      res.status(200).json({ message: "You liked the post." });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  module.exports={create,getLikesWithUserProfiles}
