const { Schema, model } = require("mongoose");

const PostSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    description: {
      type: String,
      default: null,
      minlength: 3,
      validate: {
        validator: function (value) {
          return value || this.images.length > 0;
        },
        message: "Either images or description is required.",
      },
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: function (value) {
          return value.length > 0 || this.description;
        },
        message: "Either images or description is required.",
      },
    },
  },
  { versionKey: false, timestamps: true }
);

module.exports = model("post", PostSchema);
