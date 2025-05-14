import likeController from "../controllers/like.controller.js";
import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
const likeRouter = Router();

// CRUD routes for likes
likeRouter.route("/like")
  .post(authenticate,likeController.create)     // Add a like
  .get(likeController.getAll);     // Get all likes

likeRouter.route("/like/:id")
  .get(likeController.getById)     // Get a like by ID
  .delete(authenticate,likeController.delete);  // Delete a like by ID

export default likeRouter;
