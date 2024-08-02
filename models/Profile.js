const { Schema, model } = require("mongoose");
const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  description: {
    type: String,
    default: null,
  },
  image: {
    type: String,
    default: null,
  },
  phone_number: { type: String, default: null, match: /^(0\d{9}|\+212\d{9})$/ },
},{timestamps:true,versionKey:false});
module.exports = model("profile", ProfileSchema);
