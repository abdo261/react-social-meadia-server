const { Schema, model } = require("mongoose");
const FollowSchema = new Schema(
  {
    from: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    to: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = model("follow", FollowSchema);
