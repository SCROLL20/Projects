import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

import Post from "../models/post.model.js";
import Like from "../models/like.model.js";

// Load environment variables
dotenv.config();
const SECRET = process.env.JWT_secret_key;

if (!SECRET) {
  throw new Error("JWT_secret_key is not defined in the .env file.");
}

const userController = {
  // Register a new user
  register: async (req, res) => {
    try {
      const user = new User(req.body);
      const newUser = await user.save();

      const userToken = jwt.sign({ id: newUser._id }, SECRET);
      console.log("Register User Token:", userToken);

      res
        .status(201)
        .cookie("userToken", userToken, { httpOnly: true })
        .json(newUser);
    } catch (error) {
      console.error("Registration error:", error);
      res.status(400).json(error.errors || { error: "Registration failed." });
    }
  },

  // Login an existing user
  loginUser: async (req, res) => {
    try {
      const userFromDB = await User.findOne({ email: req.body.email });

      if (!userFromDB) {
        return res.status(400).json({ error: "Invalid email or password" });
      }

      const isPasswordValid = await bcrypt.compare(
        req.body.password,
        userFromDB.password
      );

      if (!isPasswordValid) {
        return res.status(400).json({ error: "Invalid email or password" });
      }

      const userToken = jwt.sign({ id: userFromDB._id }, SECRET);
      console.log("Login User Token:", userToken);

      res
        .status(201)
        .cookie("userToken", userToken, { httpOnly: true })
        .json({
          user: userFromDB,
          message: "Login successful",
          userToken,
        });
    } catch (error) {
      console.error("Login error:", error);
      res.status(400).json({ error: "Login failed" });
    }
  },

  // Logout user
  logout: async (req, res) => {
    res.clearCookie("userToken");
    res.json({ successMessage: "User logged out" });
  },

  // Get currently logged in user (simplified)
getLoggedUser: async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ user });
  } catch (error) {
    res.status(400).json({ error: "Failed to fetch user" });
  }
},
getUserById: async (req, res) => {
	  try {
	const user = await User.findById(req.params.id).select('-password');
	if (!user) {
	  return res.status(404).json({ error: "User not found" });
	}
	user.posts = await Post.find({ userId: user._id })
	  .populate("userId", "name alias")
	  .populate("likes");
	user.likes = await Like.find({ userId: user._id })
	  .populate("userId", "name alias")
	  .populate("postId", "title");
	res.json(user);
  } catch (error) {
	console.error("Error fetching user by ID:", error);
	res.status(400).json({ error: "Failed to fetch user" });
  }
}
};


export default userController;
