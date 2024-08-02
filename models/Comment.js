const { Schema, model } = require("mongoose");
const CommentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      min: 3,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "post",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true, versionKey: false }
);
module.exports = model("comment", CommentSchema);
