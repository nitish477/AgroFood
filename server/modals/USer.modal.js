import { Schema, model } from "mongoose";
import { config } from "../config/config.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Define possible roles for the application
const rolesEnum = {
  ADMIN: "admin",
  FARMER: "farmer",
  USER: "user",
  VENDOR: "vendor",
};

const UserSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Please enter your name."],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please enter your email."],
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Please enter your password."],
    },
    roles: {
      type: [String], // Array to allow for multiple roles if necessary
      enum: Object.values(rolesEnum), // Restrict to predefined roles
      default: ["user"], // Default to "user" role
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Unique index to prevent duplicate users with the same email and role combo
UserSchema.index({ email: 1, roles: 1 }, { unique: true });

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generate JWT token with roles
UserSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      roles: this.roles, // Include roles in the JWT payload
    },
    config.jwtAccessSecret,
    {
      expiresIn: config.jwtAccessExpiration,
    }
  );
};

// Generate refresh token
UserSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    config.jwtRefreshSecret,
    {
      expiresIn: config.jwtRefreshExpiration,
    }
  );
};

export const User = model("User", UserSchema);
