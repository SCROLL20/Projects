import { model, Schema } from "mongoose";
import bcryptjs from "bcryptjs";

// Define the schema with timestamps
const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "{PATH} is required!"],
    maxLength: [255, "{PATH} must be at most 255 characters!"],
    minLength: [3, "{PATH} must be at least 3 characters!"],
  },
  alias: {
    type: String,
    required: [true, "{PATH} is required!"],
    maxLength: [255, "{PATH} must be at most 255 characters!"],
    minLength: [3, "{PATH} must be at least 3 characters!"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    validate: {
      validator: val => /^([\w-.]+@([\w-]+\.)+[\w-]+)?$/.test(val),
      message: "Please enter a valid email"
    }
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be 8 characters or longer"]
  },
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
likes: [{ type: Schema.Types.ObjectId, ref: "Like" }],
}, { timestamps: true });

// Correct virtual field
userSchema.virtual('confirmPassword')
  .get(function () {
    return this._confirmPassword;
  })
  .set(function (value) {
    this._confirmPassword = value;
  });

// Validation before save
userSchema.pre('validate', function (next) {
  console.log("Inside Password Validation");
  console.log(this.password, "----------", this.confirmPassword);
  if (this.password !== this.confirmPassword) {
    this.invalidate('confirmPassword', "Password must match");
  }
  next();
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  console.log("In Hashed Password Function");

  if (this.isModified('password')) {
    try {
      const hashedPassword = await bcryptjs.hash(this.password, 10);
      this.password = hashedPassword;
      console.log("Hashed Password =", hashedPassword);
    } catch (error) {
      console.error("Hashing error:", error);
      return next(error);
    }
  }

  next();
});

// Export the model
const User = model("User", userSchema);
export default User;