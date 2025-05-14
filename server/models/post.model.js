import { model, Schema } from "mongoose";

const postSchema = new Schema({
  title: {
    type: String,
    required: [true, "{PATH} is required!"],
    maxLength: [255, "{PATH} must be at most 255 characters!"],
    minLength: [3, "{PATH} must be at least 3 characters!"],
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

// Virtual field to populate likes
postSchema.virtual("likes", {
  ref: "Like",
  localField: "_id",
  foreignField: "postId"
});

// Ensure virtuals are included in output
postSchema.set("toObject", { virtuals: true });
postSchema.set("toJSON", { virtuals: true });

const Post = model("Post", postSchema);
export default Post;
