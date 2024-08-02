
const { Schema, model } = require("mongoose");

const LikeSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "post",
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);
module.exports = model("like", LikeSchema);
