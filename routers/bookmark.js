const { bookmarkPost, getAllBookmarks } = require('../controllers/bookmark')

const BookmarkRouter = require('express').Router()

BookmarkRouter.get('/' ,getAllBookmarks)
BookmarkRouter.post('/:postId' ,bookmarkPost)
module.exports = BookmarkRouter