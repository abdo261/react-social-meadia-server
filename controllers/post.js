const Post = require("../models/Post"); // Adjust the path as needed
const User = require("../models/User");
const Profile = require("../models/Profile");
const Like = require("../models/Like");
const Comment = require("../models/Comment");

const { formatError } = require("../utils/utils");
const validateCreatePost = require("../validation/post");
const { deleteOldImages } = require("./image");

const createPost = async (req, res) => {
  if (!req._id) {
    return res.status(401).json({ message: "You should connect first" });
  }
  try {
    const { description } = req.body;
    const imageFiles = req?.files?.images;
    const { error } = validateCreatePost({
      user: req._id,
      description,
    });
    if (error) {
      return res.status(401).json({ message: formatError(error) });
    }
    if (!description && (!imageFiles || imageFiles.length === 0)) {
      return res
        .status(400)
        .json({ message: "Either images or description is required." });
    }

    const post = new Post({
      user: req._id,
      description,
    });

    if (imageFiles && imageFiles.length > 0) {
      // Generate paths for uploaded images
      const uploadedImagePaths = imageFiles.map((file) => `${file.filename}`);
      post.images = uploadedImagePaths;
    }

    const savedPost = await post.save();
    res.status(201).json({post:savedPost,message:'post Created Successfelly'});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// const getAllPostsWithDetails = async (req, res) => {
//   try {
//     const posts = await Post.aggregate([
//       { $sort: { createdAt: -1 } },
//       { $limit: 15 },
//       {
//         $lookup: {
//           from: 'users',
//           localField: 'user',
//           foreignField: '_id',
//           as: 'user'
//         }
//       },
//       { $unwind: '$user' },
//       {
//         $lookup: {
//           from: 'profiles',
//           localField: 'user._id',
//           foreignField: 'user',
//           as: 'profile'
//         }
//       },
//       { $unwind: { path: '$profile', preserveNullAndEmptyArrays: true } },
//       {
//         $lookup: {
//           from: 'likes',
//           let: { postId: '$_id' },
//           pipeline: [
//             { $match: { $expr: { $eq: ['$post', '$$postId'] } } },
//             {
//               $lookup: {
//                 from: 'users',
//                 localField: 'user',
//                 foreignField: '_id',
//                 as: 'user'
//               }
//             },
//             { $unwind: '$user' },
//             {
//               $lookup: {
//                 from: 'profiles',
//                 localField: 'user._id',
//                 foreignField: 'user',
//                 as: 'profile'
//               }
//             },
//             { $unwind: { path: '$profile', preserveNullAndEmptyArrays: true } },
//             {
//               $project: {
//                 'user.profile.image': 1
//               }
//             }
//           ],
//           as: 'likes'
//         }
//       },
//       {
//         $lookup: {
//           from: 'comments',
//           let: { postId: '$_id' },
//           pipeline: [
//             { $match: { $expr: { $eq: ['$post', '$$postId'] } } },
//             { $count: 'commentsCount' }
//           ],
//           as: 'comments'
//         }
//       },
//       {
//         $addFields: {
//           commentsCount: { $arrayElemAt: ['$comments.commentsCount', 0] }
//         }
//       },
//       {
//         $project: {
//           _id: 1,
//           description: 1,
//           images: 1,
//           createdAt: 1,
//           updatedAt: 1,
//           user: {
//             _id: '$user._id',
//             user_name: '$user.user_name',
//             profile: {
//               image: '$profile.image'
//             }
//           },
//           likes: 1,
//           commentsCount: { $ifNull: ['$commentsCount', 0] }
//         }
//       }
//     ]);

//     res.status(200).json(posts);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'An error occurred while fetching posts.' });
//   }
// };

// const getAllPostsWithDetails = async (req, res) => {
//   try {
//     const posts = await Post.aggregate([
//       { $limit: 15 },
//       {
//         $lookup: {
//           from: 'users', // Collection name in MongoDB
//           localField: 'user',
//           foreignField: '_id',
//           as: 'userDetails'
//         }
//       },
//       { $unwind: '$userDetails' },
//       {
//         $lookup: {
//           from: 'profiles', // Collection name in MongoDB
//           localField: 'userDetails._id',
//           foreignField: 'user',
//           as: 'profileDetails'
//         }
//       },
//       { $unwind: { path: '$profileDetails', preserveNullAndEmptyArrays: true } },
//       {
//         $lookup: {
//           from: 'comments', // Collection name in MongoDB
//           localField: '_id',
//           foreignField: 'post',
//           as: 'comments'
//         }
//       },
//       {
//         $lookup: {
//           from: 'likes', // Collection name in MongoDB
//           localField: '_id',
//           foreignField: 'post',
//           as: 'likes'
//         }
//       },
//       {
//         $project: {
//           _id: 1,
//           description: 1,
//           images: 1,
//           createdAt: 1,
//           updatedAt: 1,
//           'userDetails.user_name': 1,
//           'profileDetails.image': 1,
//           comments: 1, // Add the comments field to the projection
//           likes: 1 // Add the likes field to the projection
//         }
//       }
//     ]);

//     res.status(200).json(posts);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'An error occurred while fetching posts.' });
//   }
// };

// const getAllPostsWithDetails = async (req, res) => {
//   try {
//     const posts = await Post.aggregate([
//       { $sort: { createdAt: -1 } },
//       { $limit: 15 },
//       {
//         $lookup: {
//           from: 'users',
//           localField: 'user',
//           foreignField: '_id',
//           as: 'user'
//         }
//       },
//       { $unwind: '$user' },
//       {
//         $lookup: {
//           from: 'profiles',
//           localField: 'user._id',
//           foreignField: 'user',
//           as: 'profile'
//         }
//       },
//       { $unwind: { path: '$profile', preserveNullAndEmptyArrays: true } },
//       {
//         $lookup: {
//           from: 'likes',
//           let: { postId: '$_id' },
//           pipeline: [
//             { $match: { $expr: { $eq: ['$post', '$$postId'] } } },
//             {
//               $lookup: {
//                 from: 'users',
//                 localField: 'user',
//                 foreignField: '_id',
//                 as: 'user'
//               }
//             },
//             { $unwind: '$user' },
//             {
//               $lookup: {
//                 from: 'profiles',
//                 localField: 'user._id',
//                 foreignField: 'user',
//                 as: 'profile'
//               }
//             },
//             { $unwind: { path: '$profile', preserveNullAndEmptyArrays: true } },
//             {
//               $project: {
//                 _id: 1,
//                 'user._id': 1,
//                 'user.user_name': 1,
//                 'profile.image': 1
//               }
//             }
//           ],
//           as: 'likes'
//         }
//       },
//       {
//         $lookup: {
//           from: 'comments',
//           let: { postId: '$_id' },
//           pipeline: [
//             { $match: { $expr: { $eq: ['$post', '$$postId'] } } },
//             { $count: 'commentsCount' }
//           ],
//           as: 'comments'
//         }
//       },
//       {
//         $addFields: {
//           commentsCount: { $arrayElemAt: ['$comments.commentsCount', 0] }
//         }
//       },
//       {
//         $project: {
//           _id: 1,
//           description: 1,
//           images: 1,
//           createdAt: 1,
//           updatedAt: 1,
//           user: {
//             _id: '$user._id',
//             user_name: '$user.user_name',
//             profile: {
//               image: '$profile.image'
//             }
//           },
//           likes: {
//             $map: {
//               input: '$likes',
//               as: 'like',
//               in: {
//                 _id: '$$like._id',
//                 user: {
//                   _id: '$$like.user._id',
//                   user_name: '$$like.user.user_name',
//                   profile: {
//                     image: '$$like.profile.image'
//                   }
//                 }
//               }
//             }
//           },
//           commentsCount: { $ifNull: ['$commentsCount', 0] }
//         }
//       }
//     ]);

//     res.status(200).json(posts);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'An error occurred while fetching posts.' });
//   }
// };

const getAllPostsWithDetails = async (req, res) => {
  try {
    const posts = await Post.aggregate([
      { $sort: { createdAt: -1 } },
      { $limit: 15 },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "profiles",
          localField: "user._id",
          foreignField: "user",
          as: "profile",
        },
      },
      { $unwind: { path: "$profile", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "likes",
          let: { postId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$post", "$$postId"] } } },
            {
              $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user",
              },
            },
            { $unwind: "$user" },
            {
              $lookup: {
                from: "profiles",
                localField: "user._id",
                foreignField: "user",
                as: "profile",
              },
            },
            { $unwind: { path: "$profile", preserveNullAndEmptyArrays: true } },
            {
              $project: {
                _id: 1,
                createdAt: 1,
                updatedAt: 1,
                "user._id": 1,
                "user.user_name": 1,
                "profile.image": 1,
              },
            },
          ],
          as: "likes",
        },
      },
      {
        $lookup: {
          from: "comments",
          let: { postId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$post", "$$postId"] } } },
            { $project: { _id: 1 } }, // Include only the comment IDs
          ],
          as: "comments",
        },
      },
      {
        $project: {
          _id: 1,
          description: 1,
          images: 1,
          createdAt: 1,
          updatedAt: 1,
          user: {
            _id: "$user._id",
            user_name: "$user.user_name",
            profile: {
              image: "$profile.image",
            },
          },
          likes: {
            $map: {
              input: "$likes",
              as: "like",
              in: {
                _id: "$$like._id",
                createdAt: "$$like.createdAt",
                updatedAt: "$$like.updatedAt",
                user: {
                  _id: "$$like.user._id",
                  user_name: "$$like.user.user_name",
                  profile: {
                    image: "$$like.profile.image",
                  },
                },
              },
            },
          },
          comments: {
            $map: {
              input: "$comments",
              as: "comment",
              in: "$$comment._id",
            },
          },
        },
      },
    ]);

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching posts." });
  }
};

const editPost = async (req, res) => {
  if (!req._id) {
    return res.status(401).json({ message: "You should connect first" });
  }

  try {
    const { postId } = req.params; // Get post ID from URL params
    const { description } = req.body;
    const newImageFiles = req?.files?.images;

    // Validate post ID and check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Update post description if provided
    if (description) {
      post.description = description;
    }

    // Update images if new ones are provided
    if (newImageFiles && newImageFiles.length > 0) {
      // Delete old images
      if (post.images && post.images.length > 0) {
        deleteOldImages(post.images);
      }

      // Generate paths for new uploaded images
      const uploadedImagePaths = newImageFiles.map(
        (file) => `${file.filename}`
      );
      post.images = uploadedImagePaths;
    }

    // Save updated post
    const updatedPost = await post.save();
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};
const deletePost = async (req, res) => {
  if (!req._id) {
    return res.status(401).json({ message: "You should connect first" });
  }

  try {
    const { postId } = req.params; // Get post ID from URL params

   
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }


    if (post.images && post.images.length > 0) {
      deleteOldImages(post.images);
    }

 
    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: "Post deleted successfully",_id:postId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};
const getAllPostsWithDetailsByIds = async (req, res) => {
  try {
    const postIds = req.body.postIds;

    if (!Array.isArray(postIds)) {
      return res.status(400).json({ error: "postIds must be an array." });
    }

    const posts = await Post.aggregate([
      { $match: { _id: { $in: postIds } } },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "profiles",
          localField: "user._id",
          foreignField: "user",
          as: "profile",
        },
      },
      { $unwind: { path: "$profile", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "likes",
          let: { postId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$post", "$$postId"] } } },
            {
              $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user",
              },
            },
            { $unwind: "$user" },
            {
              $lookup: {
                from: "profiles",
                localField: "user._id",
                foreignField: "user",
                as: "profile",
              },
            },
            { $unwind: { path: "$profile", preserveNullAndEmptyArrays: true } },
            {
              $project: {
                _id: 1,
                createdAt: 1,
                updatedAt: 1,
                "user._id": 1,
                "user.user_name": 1,
                "profile.image": 1,
              },
            },
          ],
          as: "likes",
        },
      },
      {
        $lookup: {
          from: "comments",
          let: { postId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$post", "$$postId"] } } },
            { $project: { _id: 1 } }, // Include only the comment IDs
          ],
          as: "comments",
        },
      },
      {
        $project: {
          _id: 1,
          description: 1,
          images: 1,
          createdAt: 1,
          updatedAt: 1,
          user: {
            _id: "$user._id",
            user_name: "$user.user_name",
            profile: {
              image: "$profile.image",
            },
          },
          likes: {
            $map: {
              input: "$likes",
              as: "like",
              in: {
                _id: "$$like._id",
                createdAt: "$$like.createdAt",
                updatedAt: "$$like.updatedAt",
                user: {
                  _id: "$$like.user._id",
                  user_name: "$$like.user.user_name",
                  profile: {
                    image: "$$like.profile.image",
                  },
                },
              },
            },
          },
          comments: {
            $map: {
              input: "$comments",
              as: "comment",
              in: "$$comment._id",
            },
          },
        },
      },
    ]);

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching posts." });
  }
};

module.exports = {
  createPost,
  getAllPostsWithDetails,
  editPost,
  deletePost,
  getAllPostsWithDetailsByIds,
};
