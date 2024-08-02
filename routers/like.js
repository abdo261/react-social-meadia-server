const LikeRouter = require("express").Router();
const { create, getLikesWithUserProfiles } = require("../controllers/like");

LikeRouter.post("/:post", create);
LikeRouter.get("/", getLikesWithUserProfiles);

module.exports = LikeRouter;
