import userController from "../controllers/user.controller.js";
import {Router} from "express";
import { authenticate } from "../middlewares/auth.middleware.js";

const router=Router();

router.route("/register").post(userController.register)
router.route("/login").post(userController.loginUser)
router.route("/logout").post(userController.logout)
router.route("/user").get(authenticate, userController.getLoggedUser)
router.route("/users/:id").get(userController.getUserById)

export default router
