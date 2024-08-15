const express = require("express");
const authRouter = require("./routers/auth");
const followRouter = require("./routers/follow");
const isAuth = require("./middleware/auth");
const PostRouter = require("./routers/post");
const imageRouter = require("./routers/image");
const LikeRouter = require("./routers/like");
const CommentRouter = require("./routers/comment");
const BookmarkRouter = require("./routers/bookmark");
const cors = require('cors')
const app = express();

require('dotenv').config(); 
require("./config/connection");
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001','https://react-social-meadia-client-781suvnzf.vercel.app/'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use((req, res, next) => {
    if (!req.originalUrl.startsWith('/auth') && !req.originalUrl.startsWith('/images')) {
      isAuth(req, res, next);
    } else {
      next();
    }
  });

  

  
app.use('/auth',authRouter)
app.use('/follow',followRouter)
app.use('/posts',PostRouter)
app.use('/images',imageRouter)
app.use('/likes',LikeRouter)
app.use('/comments',CommentRouter)
app.use('/bookmarks',BookmarkRouter)
app.listen(process.env.PORT || 5000, () => console.log(`server raning in port ${process.env.PORT}`));
