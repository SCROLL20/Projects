import { model, Schema } from "mongoose";

const likeSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: true
  }
}, { timestamps: true });

// Prevent duplicate likes per user per post
likeSchema.index({ userId: 1, postId: 1 }, { unique: true });

const Like = model("Like", likeSchema);
export default Like;
