const Bookmark = require("../models/Bookmark");


const bookmarkPost = async (req, res) => {
    try {
      const { postId } = req.params;
  
      // Find the bookmark for the user
      let bookmark = await Bookmark.findOne({ user: req._id });
  
      if (!bookmark) {
        // If no bookmark exists for the user, create a new one with the post
        const newBookmark = new Bookmark({
          user: req._id,
          posts: [postId],
        });
        await newBookmark.save();
        return res.status(201).json({ message: "You have saved this post to bookmarks." });
      }
  
      // Check if the post is already in the user's bookmarks
      const postIndex = bookmark.posts.indexOf(postId);
  
      if (postIndex !== -1) {
        // If the post is found, remove it from the bookmarks
        bookmark.posts.splice(postIndex, 1);
        await bookmark.save();
        return res.status(200).json({ message: "You have removed this post from bookmarks." });
      } else {
        // If the post is not found, add it to the bookmarks
        bookmark.posts.push(postId);
        await bookmark.save();
        return res.status(201).json({ message: "You have saved this post to bookmarks." });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error." });
    }
  };
  
//   const getAllBookmarks = async (req, res) => {
//     try {
//         // Retrieve the bookmark for the logged-in user
//         const bookmark = await Bookmark.findOne({ user: req._id }).populate({
//             path: 'posts',
//             populate: {
//                 path: 'user',
//                 select: 'user_name',
//                 populate: {
//                     path: 'profile',
//                     select: 'image'
//                 }
//             }
//         });

//         if (!bookmark || bookmark.posts.length === 0) {
//             return res.status(404).json({ message: "You don't have any bookmarks." });
//         }

//         res.status(200).json(bookmark);
//     } catch (error) {
//         console.error("Error fetching bookmarks:", error);
//         res.status(500).json({ error: 'An error occurred while fetching bookmarks.' });
//     }
// };

const getAllBookmarks = async (req, res) => {
  try {
      // Retrieve the bookmark for the logged-in user
      const bookmark = await Bookmark.findOne({ user: req._id }).populate({
          path: 'posts',
          populate: {
              path: 'user',
              select: 'user_name',
              populate: {
                  path: 'profile',
                  select: 'image'
              }
          }
      });

      if (!bookmark || bookmark.posts.length === 0) {
          return res.status(404).json({ message: "You don't have any bookmarks." });
      }

      // Transform the response to include user profile image
      const transformedPosts = bookmark.posts.map(post => {
          return {
              _id: post._id,
              user: {
                  _id: post.user._id,
                  user_name: post.user.user_name,
                  profile_image: post.user.profile?.image || null
              },
              description: post.description,
              images: post.images,
              createdAt: post.createdAt,
              updatedAt: post.updatedAt
          };
      });

      const response = {
          _id: bookmark._id,
          user: bookmark.user,
          posts: transformedPosts,
          createdAt: bookmark.createdAt,
          updatedAt: bookmark.updatedAt
      };

      res.status(200).json(response);
  } catch (error) {
      console.error("Error fetching bookmarks:", error);
      res.status(500).json({ error: 'An error occurred while fetching bookmarks.' });
  }
};
module.exports = { bookmarkPost,getAllBookmarks };
