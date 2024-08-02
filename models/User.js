const { Schema, model } = require("mongoose");
const UserSchema = new Schema(
  {
    user_name: { type: String, required: true, minlength: 3 },
    email: {
      type: String,
      require: true,
      unique: true,
      minlength: 13,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

UserSchema.virtual('profile', {
  ref: 'profile',
  localField: '_id',
  foreignField: 'user',
  justOne: true
});

module.exports = model("user", UserSchema);
