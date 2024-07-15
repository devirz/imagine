"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    userId: Number,
    firstName: String,
    username: String,
    charge: { type: Number, required: true },
    step: { type: String, default: "null" },
    dateJoined: { type: Date, default: Date.now }
});
const User = (0, mongoose_1.model)("User", userSchema);
exports.default = User;
