const express = require('express');
const PostRouter = express.Router();
const upload = require('../middleware/upload');  // Adjust path as needed
const { createPost, getAllPostsWithDetails, editPost, deletePost, getAllPostsWithDetailsByIds } = require('../controllers/post');  // Adjust path as needed

// Handle multiple file uploads
PostRouter.post('/', upload.fields([{ name: 'images', maxCount: 10 }]), createPost);
PostRouter.get('/',  getAllPostsWithDetails);
PostRouter.get('/bookmarked',  getAllPostsWithDetailsByIds);
PostRouter.put('/:postId', upload.fields([{ name: 'images', maxCount: 10 }]),  editPost);
PostRouter.delete('/:postId',  deletePost);

module.exports = PostRouter;
