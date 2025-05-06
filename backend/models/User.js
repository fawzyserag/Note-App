const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: {
      type: String,
      required: [true, "Mobile number is required"],
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [0, "Age must be a positive number"],
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: [true, "Gender is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
