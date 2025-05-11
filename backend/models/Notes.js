const mongoose = require("mongoose");

const noteSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // 🔗 ربط النوت بالمستخدم
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Note", noteSchema);
