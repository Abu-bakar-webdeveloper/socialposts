import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    desc: String,
    image: String,
  },
  {
    timestamps: true,
  }
);

var PostModel = mongoose.model("Post", postSchema);
export default PostModel;