const CommentRouter = require("express").Router();
const { create, getCommentsWithUserProfiles } = require("../controllers/comment");

CommentRouter.post("/:post", create);
CommentRouter.get("/", getCommentsWithUserProfiles);

module.exports = CommentRouter;
