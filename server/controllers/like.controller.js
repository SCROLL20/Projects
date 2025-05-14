import Like from "../models/like.model.js";

const likeController = {
  // Add a like
  create: async (req, res) => {
    try {
      const { postId } = req.body;
      const userId = req.user.id; // Assumes user ID is available in req.user
      const newLike = await Like.create({ userId, postId });
      res.status(201).json(newLike);
    } catch (error) {
      if (error.code === 11000) {
        res.status(400).json({ error: "User has already liked this post" });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  },

  // Get all likes
  getAll: async (req, res) => {
    try {
      const likes = await Like.find()
        .populate("userId", "name alias")
        .populate("postId", "title");
      res.json(likes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get a single like by ID
  getById: async (req, res) => {
    try {
      const like = await Like.findById(req.params.id)
        .populate("userId", "name alias")
        .populate("postId", "title");
      if (!like) return res.status(404).json({ error: "Like not found" });
      res.json(like);
    } catch (error) {
      res.status(400).json({ error: "Invalid like ID" });
    }
  },

  // Delete a like by ID
 delete: async (req, res) => {
  try {
    const like = await Like.findById(req.params.id);
    if (!like) return res.status(404).json({ error: "Like not found" });

    if (like.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to delete this like" });
    }

    await like.deleteOne();
    res.json({ message: "Like deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
},
}

export default likeController;
