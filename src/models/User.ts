import { Schema, model } from "mongoose";

const userSchema = new Schema({
  userId: Number,
  firstName: String,
  username: String,
  charge: { type: Number, required: true },
  step: { type: String, default: "null" },
  dateJoined: { type: Date, default: Date.now }
})

const User = model("User", userSchema)
export default User