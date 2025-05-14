import postController from "../controllers/post.controller.js";
import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js"; // path may vary
const postRouter = Router();

// CRUD routes for posts
postRouter.route("/post")
  .post(authenticate, postController.create)     // Create a post
  .get(postController.getAll);      // Get all posts

postRouter.route("/post/:id")
  .get(postController.getById)      // Get a post by ID
  .put(authenticate, postController.update)
  .delete(authenticate, postController.delete); // Delete a post by ID

export default postRouter;
