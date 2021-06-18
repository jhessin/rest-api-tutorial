import { Schema } from "mongoose";
import mongoose from "../database/mongodb";

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    index: {
      unique: true,
    },
  },
});

export const User = mongoose.model("user", userSchema);
