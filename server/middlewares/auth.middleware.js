import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const SECRET = process.env.JWT_secret_key;

export const authenticate = (req, res, next) => {
  const token = req.cookies.userToken;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; // sets req.user.id
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
