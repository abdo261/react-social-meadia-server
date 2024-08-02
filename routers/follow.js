const { create, getUserFollowing, getUserFollowers } = require("../controllers/follow");
const followRouter = require("express").Router();

followRouter.post("/:userId", create);
followRouter.get('/following/:userId', getUserFollowing);
followRouter.get('/followers/:userId', getUserFollowers);

module.exports = followRouter;
