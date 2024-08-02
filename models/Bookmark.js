const { Schema, model } = require("mongoose");
const BookmarkSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "post",
        require: true,
      },
    ],
  },
  { timestamps: true, versionKey: false }
);
 module.exports = model('bookmark' ,BookmarkSchema )