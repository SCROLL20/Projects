import Post from "../models/post.model.js";
import Like from "../models/like.model.js";
import User from "../models/user.model.js";

const postController = {
  // Create a new post
 create: async (req, res) => {
  try {
    const { title } = req.body;
    const userId = req.user.id; // from token
    const newPost = await Post.create({ title, userId });
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
},


  // Get all posts
  getAll: async (req, res) => {
    try {
      const posts = await Post.find()
        .populate("userId", "name alias")
        .populate("likes");
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get a single post by ID
  getById: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id)
        .populate("userId", "name alias")
        .populate("likes");
      if (!post) return res.status(404).json({ error: "Post not found" });
      res.json(post);
    } catch (error) {
      res.status(400).json({ error: "Invalid post ID" });
    }
  },

  // Update a post by ID
  update: async (req, res) => {
    try {
      const updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        { title: req.body.title },
        { new: true, runValidators: true }
      );
      if (!updatedPost) return res.status(404).json({ error: "Post not found" });
      res.json(updatedPost);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Delete a post by ID
  delete: async (req, res) => {
    try {
      const deletedPost = await Post.findByIdAndDelete(req.params.id);
      if (!deletedPost) return res.status(404).json({ error: "Post not found" });
      // Optionally, delete associated likes
      await Like.deleteMany({ postId: req.params.id });
      res.json({ message: "Post deleted successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

export default postController;
