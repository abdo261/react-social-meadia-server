const CommentRouter = require("express").Router();
const { create, getCommentsWithUserProfiles, getCommentsByPostId } = require("../controllers/comment");

CommentRouter.post("/:post", create);
CommentRouter.post("/", getCommentsWithUserProfiles);
CommentRouter.get("/post/:postId", getCommentsByPostId);

module.exports = CommentRouter;
